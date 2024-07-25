import fs from "fs";
import {unified} from 'unified';
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import path from "path";

async function processMarkdown(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  
  return result.toString();
}

const htmlDir = 'public/html'
export default async function generateHtmlFiles() {
  const fileListJson = fs.readFileSync('public/markdown-files.json', 'utf-8');
  const files = JSON.parse(fileListJson)
  for (const file of files) {
    const html = await processMarkdown(file);
    const htmlFilePath = path.join(htmlDir, file.replace('.md', '.html'))
    const dirPath = path.dirname(htmlFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(htmlFilePath, html, 'utf-8');
  }
}