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

const sourceDir = 'public/sources';
async function processMarkdown(file) {
	const filePath = path.join(sourceDir, file).normalize('NFC')
	const markdown = fs.readFileSync(filePath, 'utf-8');
	const title = file.normalize('NFC').split('/').pop().replace('.md', '');
	const result = await unified()
		.use(remarkParse)
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
		.use(rehypeStringify, {allowDangerousHtml: true})
		.process(markdown);
	
	return result.toString();
}

const htmlDir = 'public/html'
export default async function generateHtmlFiles() {
  const fileSet = getMarkdownFileSet()
  for (const file of fileSet) {
    const html = await processMarkdown(file);
    const htmlFilePath = path.join(htmlDir, file.replace('.md', '.html'))
    const dirPath = path.dirname(htmlFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(htmlFilePath, html, 'utf-8');
  }
}