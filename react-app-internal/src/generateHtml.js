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
const htmlDir = 'public/html';
const seoDir = 'public/posts';
const sitemapPath = 'public/sitemap.xml';
const robotsPath = 'public/robots.txt';

function readPublishData() {
	try {
		const raw = fs.readFileSync('src/stores/data.json', 'utf-8');
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

export function normalizeRepositoryUrlToSiteBase(repositoryUrl = '') {
	const normalizedUrl = repositoryUrl.trim();
	if (!normalizedUrl) {
		return '';
	}

	const githubSsh = normalizedUrl.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i);
	if (githubSsh && githubSsh[2].toLowerCase() === `${githubSsh[1].toLowerCase()}.github.io`) {
		return `https://${githubSsh[1]}.github.io`;
	}

	const githubHttp = normalizedUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
	if (githubHttp && githubHttp[2].toLowerCase() === `${githubHttp[1].toLowerCase()}.github.io`) {
		return `https://${githubHttp[1]}.github.io`;
	}

	const pagesUrl = normalizedUrl.match(/^https?:\/\/([^/]+\.github\.io)\/?$/i);
	if (pagesUrl) {
		return `https://${pagesUrl[1].toLowerCase()}`;
	}

	return '';
}

function normalizeWebPath(filePath = '') {
	return filePath.replace(/\\/g, '/').replace(/^\/+/, '');
}

function toHtmlPath(filePath = '') {
	return normalizeWebPath(filePath).replace(/\.md$/i, '.html');
}

function toSeoPath(filePath = '') {
	return `/posts/${toHtmlPath(filePath)}`;
}

function encodeUrlPath(filePath = '') {
	return filePath
		.split('/')
		.filter((segment) => segment !== '')
		.map((segment) => encodeURIComponent(segment))
		.join('/');
}

function escapeHtml(value = '') {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function buildMetaDescription(markdown = '', title = 'Document') {
	const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\s*/m, '');
	const textOnly = contentWithoutFrontmatter
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
		.replace(/[#>*_~\-|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	if (!textOnly) {
		return `${title} - Published by Vault To Blog`;
	}

	return textOnly.slice(0, 155);
}

export function convertInternalLinksForSeo(html = '') {
	return html.replace(/<a href="\/([^"#?]+)"([^>]*class="[^"]*internal-link[^"]*"[^>]*)>/g, (_full, targetPath, trailingAttributes) => {
		const resolvedPath = toSeoPath(targetPath);
		const encodedPath = '/' + encodeUrlPath(resolvedPath);
		return `<a href="${encodedPath}"${trailingAttributes}>`;
	});
}

function buildCanonicalUrl(siteBaseUrl, pathName) {
	if (pathName === '/') {
		return `${siteBaseUrl}/`;
	}

	const normalizedPath = pathName.replace(/^\/+/, '');
	return `${siteBaseUrl}/${encodeUrlPath(normalizedPath)}`;
}

export function buildSitemapXml(urls = []) {
	const body = urls
		.filter(Boolean)
		.map((url) => {
			return `<url><loc>${escapeHtml(url)}</loc></url>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`;
}

export function buildRobotsTxt(siteBaseUrl) {
	const lines = ['User-agent: *', 'Allow: /', `Sitemap: ${siteBaseUrl}/sitemap.xml`];
	return `${lines.join('\n')}\n`;
}

function createSeoHtmlDocument({title, description, canonicalUrl, bodyHtml}) {
	const escapedTitle = escapeHtml(title);
	const escapedDescription = escapeHtml(description);
	const escapedCanonicalUrl = escapeHtml(canonicalUrl);

	return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${escapedTitle}</title>\n<meta name="description" content="${escapedDescription}">\n<meta name="robots" content="index,follow">\n<link rel="canonical" href="${escapedCanonicalUrl}">\n<meta property="og:type" content="article">\n<meta property="og:title" content="${escapedTitle}">\n<meta property="og:description" content="${escapedDescription}">\n<meta property="og:url" content="${escapedCanonicalUrl}">\n</head>\n<body>\n<main class="markdown-preview-sizer markdown-preview-section">\n${bodyHtml}\n</main>\n</body>\n</html>\n`;
}

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
	return {html: result.toString(), toc: root, markdown, title};
}

export default async function generateHtmlFiles() {
	const publishData = readPublishData();
	const siteBaseUrl = normalizeRepositoryUrlToSiteBase(publishData.repositoryUrl);
	const fileSet = getMarkdownFileSet()
	const tocMap = {};
	const sitemapUrls = [];
	for (const file of fileSet) {
		const {html, toc, markdown, title} = await processMarkdown(file);
		tocMap[file] = toc;
		const htmlFilePath = path.join(htmlDir, toHtmlPath(file))
		const dirPath = path.dirname(htmlFilePath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		fs.writeFileSync(htmlFilePath, html, 'utf-8');

		const seoPath = path.join(seoDir, toHtmlPath(file));
		const seoDirPath = path.dirname(seoPath);
		if (!fs.existsSync(seoDirPath)) {
			fs.mkdirSync(seoDirPath, { recursive: true });
		}

		const canonicalUrl = buildCanonicalUrl(siteBaseUrl, toSeoPath(file));
		const seoHtml = createSeoHtmlDocument({
			title,
			description: buildMetaDescription(markdown, title),
			canonicalUrl,
			bodyHtml: convertInternalLinksForSeo(html),
		});
		fs.writeFileSync(seoPath, seoHtml, 'utf-8');

		if (canonicalUrl) {
			sitemapUrls.push(canonicalUrl);
		}
	}
	
	fs.writeFileSync('public/toc.json', JSON.stringify(tocMap, null, 2), { encoding: 'utf-8' });
	sitemapUrls.unshift(buildCanonicalUrl(siteBaseUrl, '/'));
	fs.writeFileSync(sitemapPath, buildSitemapXml(sitemapUrls), 'utf-8');
	fs.writeFileSync(robotsPath, buildRobotsTxt(siteBaseUrl), 'utf-8');
}
