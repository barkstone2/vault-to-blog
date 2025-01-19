import fs from "fs";
import {unified} from 'unified';
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import path from "path";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {getMarkdownFileSet} from "./utils/file/fileUtils.js";
import remarkFrontmatter from "remark-frontmatter";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import remarkObsidian from "./utils/parser/remarkObsidian.js";
import rehypeCallout from "./utils/parser/rehypeCallout.js";
import rehypePrism from "rehype-prism";
import './utils/prismjsLanguages'
import rehypeSlug from "rehype-slug";
import extractToc from "@jasonlamv-t/remark-toc-extract";
import {createTocTree} from "./utils/tocUtils";

const sourceDir = 'public/sources';
async function processMarkdown(file) {
	const filePath = path.join(sourceDir, file).normalize('NFC')
	const markdown = fs.readFileSync(filePath, 'utf-8');
	const title = file.normalize('NFC').split('/').pop().replace('.md', '');
	
	let toc = [];
	const result = await unified()
		.use(remarkParse)
		.use(extractToc, {
			callback: (headers) => {
				toc = headers;
			},
			depthLimit: 6
		})
		.use(remarkFrontmatter)
		.use(remarkParseFrontmatter)
		.use(remarkBreaks)
		.use(remarkObsidian, {title})
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkRehype, {allowDangerousHtml: true})
		.use(rehypeKatex)
		.use(rehypePrism)
		.use(rehypeCallout)
		.use(rehypeSlug)
		.use(rehypeStringify, {allowDangerousHtml: true})
		.process(markdown);
	
	toc.forEach(h => {h.children = []})
	
	const root = createTocTree(toc);
	return {html: result.toString(), toc: root};
}

const htmlDir = 'public/html'
export default async function generateHtmlFiles() {
  const fileSet = getMarkdownFileSet()
	const tocMap = {};
  for (const file of fileSet) {
    const {html, toc} = await processMarkdown(file);
		tocMap[file] = toc;
    const htmlFilePath = path.join(htmlDir, file.replace('.md', '.html'))
    const dirPath = path.dirname(htmlFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(htmlFilePath, html, 'utf-8');
  }
	
	fs.writeFileSync('public/toc.json', JSON.stringify(tocMap, null, 2), { encoding: 'utf-8' });
}