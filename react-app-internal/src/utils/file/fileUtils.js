import fs from "fs";
import path from "path";
import mime from "mime";
import data from "../../stores/data.json";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'image-files.json';
const markdownJsonFilePath = 'markdown-files.json';
const markdownSearchJsonFilePath = 'markdown-search.json';

const addToFileMap = (fileMap, key, value) => {
  if (!fileMap[key]) {
    fileMap[key] = [value];
  } else {
    fileMap[key].push(value);
  }
}

function readDirectoryEntries(dir) {
  return fs.readdirSync(dir, { encoding: 'utf-8', withFileTypes: true });
}

function getEntryName(entry) {
  return typeof entry === 'string' ? entry : entry.name;
}

function isDirectoryEntry(entry, filePath) {
  if (typeof entry === 'string') {
    return fs.statSync(filePath).isDirectory();
  }

  if (entry.isDirectory()) {
    return true;
  }

  if (entry.isSymbolicLink()) {
    return fs.statSync(filePath).isDirectory();
  }

  return false;
}

function traverseImageRecursively(dir, fileMap) {
  const entries = readDirectoryEntries(dir);
  entries.forEach((entry) => {
    const entryName = getEntryName(entry);
    const filePath = path.join(dir, entryName);
    if (isDirectoryEntry(entry, filePath)) {
      traverseImageRecursively(filePath, fileMap);
      return;
    }

    const mimeType = mime.getType(entryName);
    if (mimeType && mimeType.startsWith('image/')) {
      const fileNameKey = entryName.normalize('NFC');
      const relativePath = path.relative(sourceDir, filePath).normalize('NFC')

      addToFileMap(fileMap, fileNameKey, relativePath);
      if (fileNameKey !== relativePath) {
        addToFileMap(fileMap, relativePath, relativePath);
      }
    }
  });

  return fileMap;
}

function traverseFilesRecursively(dir, fileMap) {
  const entries = readDirectoryEntries(dir);
  entries.forEach((entry) => {
    const entryName = getEntryName(entry);
    const filePath = path.join(dir, entryName);
    if (isDirectoryEntry(entry, filePath)) {
      traverseFilesRecursively(filePath, fileMap);
      return;
    }

    if (entryName.endsWith('.md')) {
      const fileNameKey = entryName.replace('.md', '').normalize('NFC');
      const relativePath = path.relative(sourceDir, filePath).normalize('NFC')
      const relativePathKey = relativePath.replace('.md', '')

      addToFileMap(fileMap, fileNameKey, relativePath);
      if (relativePathKey !== fileNameKey) {
        addToFileMap(fileMap, relativePathKey, relativePath);
      }
    }
  });

  return fileMap;
}

function normalizeSearchText(markdownText = '') {
  return markdownText.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function traverseMarkdownSearchRecursively(dir, searchMap) {
  const entries = readDirectoryEntries(dir);
  for (const entry of entries) {
    const entryName = getEntryName(entry);
    const filePath = path.join(dir, entryName);
    if (isDirectoryEntry(entry, filePath)) {
      traverseMarkdownSearchRecursively(filePath, searchMap);
      continue;
    }

    if (!entryName.endsWith('.md')) {
      continue;
    }

    const relativePath = path.relative(sourceDir, filePath).normalize('NFC');
    const markdown = fs.readFileSync(filePath, 'utf-8');
    searchMap[relativePath] = normalizeSearchText(markdown);
  }
  return searchMap;
}

async function buildMarkdownSearchMapFromMarkdownFiles() {
  const fallbackSearchMap = {};
  const markdownPathSet = new Set();
  for (const fileKey in getMarkdownFileMap()) {
    const markdownPaths = markdownFileMap[fileKey] || [];
    markdownPaths.forEach((markdownPath) => markdownPathSet.add(markdownPath));
  }

  const tasks = [...markdownPathSet].map(async (markdownPath) => {
    try {
      const response = await fetch('/sources/' + markdownPath);
      const markdownText = await response.text();
      fallbackSearchMap[markdownPath] = normalizeSearchText(markdownText);
    } catch (error) {
      console.log('Failed to fetch markdown source for search map.', markdownPath, error);
    }
  });

  await Promise.all(tasks);
  return fallbackSearchMap;
}

let tocMap = {};
export async function initTocMap() {
  try {
    const response = await fetch("/toc.json");
    tocMap = await response.json();
  } catch (error) {
    console.error(error);
  }
}

export function getTocMap() {
 return tocMap;
}


let markdownFileMap = {};
export async function initMarkdownFileMap() {
  try {
    const response = await fetch("/" + markdownJsonFilePath)
    markdownFileMap = await response.json();
  } catch (error) {
    console.log('Failed to initialize markdown file map.', error);
  }
}

export function getMarkdownFileMap() {
  return markdownFileMap;
}

let markdownSearchMap = {};
export async function initMarkdownSearchMap() {
  try {
    const response = await fetch('/' + markdownSearchJsonFilePath);
    markdownSearchMap = await response.json();
  } catch (error) {
    console.log('Failed to initialize markdown search map.', error);
    if (Object.keys(markdownFileMap).length === 0) {
      await initMarkdownFileMap();
    }
    markdownSearchMap = await buildMarkdownSearchMapFromMarkdownFiles();
  }
}

export function getMarkdownSearchMap() {
  return markdownSearchMap;
}

export function normalizeIndexFilePath(indexFilePath, sourceDir) {
  if (!indexFilePath) {
    return '';
  }

  const normalizedIndexPath = indexFilePath.normalize('NFC');
  if (!sourceDir) {
    return normalizedIndexPath;
  }

  const normalizedSourceDir = sourceDir.normalize('NFC').replace(/^\/+|\/+$/g, '');
  const sourcePrefix = `${normalizedSourceDir}/`;
  if (normalizedIndexPath.startsWith(sourcePrefix)) {
    return normalizedIndexPath.substring(sourcePrefix.length);
  }

  return normalizedIndexPath;
}

export function getIndexFilePath() {
  return normalizeIndexFilePath(data.indexFilePath || '', data.sourceDir || '');
}

let markdownFileSet = null;
export function getMarkdownFileSet() {
  if (!markdownFileSet) {
    const result = new Set();
    for (const fileKey in getMarkdownFileMap()) {
      markdownFileMap[fileKey].forEach(file => result.add(file));
    }
    markdownFileSet = result;
  }
  return markdownFileSet;
}

let imageFileMap = {};
export async function initImageFileMap() {
  try {
    const response = await fetch("/" + imageJsonFilePath)
    imageFileMap = await response.json();
  } catch (error) {
    console.log('Failed to initialize image file map.', error);
  }
}

export function getImageFileMap() {
  return imageFileMap;
}

export function createImageMapToJson() {
  const fileMap = {};
  traverseImageRecursively(sourceDir, fileMap);
  fs.writeFileSync('public/' + imageJsonFilePath, JSON.stringify(fileMap, null, 2), { encoding: 'utf-8' });
  imageFileMap = fileMap;
}

export function createFileMapToJson() {
  const fileMap = {};
  traverseFilesRecursively(sourceDir, fileMap);
  fs.writeFileSync('public/' + markdownJsonFilePath, JSON.stringify(fileMap, null, 2), { encoding: 'utf-8' });
  markdownFileMap = fileMap;
}

export function createMarkdownSearchMapToJson() {
  const searchMap = {};
  traverseMarkdownSearchRecursively(sourceDir, searchMap);
  fs.writeFileSync('public/' + markdownSearchJsonFilePath, JSON.stringify(searchMap, null, 2), { encoding: 'utf-8' });
  markdownSearchMap = searchMap;
}

export function initSourceDirectory() {
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
}
