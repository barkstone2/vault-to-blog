import fs from "fs";
import path from "path";
import mime from "mime";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'image-files.json';
const markdownJsonFilePath = 'markdown-files.json';

const addToFileMap = (fileMap, key, value) => {
  if (!fileMap[key]) {
    fileMap[key] = [value];
  } else {
    fileMap[key].push(value);
  }
}

function traverseImageRecursively(dir, fileMap) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8' });
  const directories = [];
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const mimeType = mime.getType(file);
    if (fs.statSync(filePath).isDirectory()) {
      directories.push(file);
    } else {
      if (mimeType && mimeType.startsWith('image/')) {
        const fileNameKey = file.normalize('NFC');
        const relativePath = path.relative(sourceDir, filePath).normalize('NFC')
        
        addToFileMap(fileMap, fileNameKey, relativePath);
        if (fileNameKey !== relativePath) {
          addToFileMap(fileMap, relativePath, relativePath);
        }
      }
    }
  });
  
  directories.forEach((file) => {
    const filePath = path.join(dir, file);
    traverseImageRecursively(filePath, fileMap);
  })
  return fileMap;
}

function traverseFilesRecursively(dir, fileMap) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8' });
  const directories = [];
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      directories.push(file);
    } else if (file.endsWith('.md')) {
      const fileNameKey = file.replace('.md', '').normalize('NFC');
      const relativePath = path.relative(sourceDir, filePath).normalize('NFC')
      const relativePathKey = relativePath.replace('.md', '')
      
      addToFileMap(fileMap, fileNameKey, relativePath);
      if (relativePathKey !== fileNameKey) {
        addToFileMap(fileMap, relativePathKey, relativePath);
      }
    }
  });
  
  directories.forEach((file) => {
    const filePath = path.join(dir, file);
    traverseFilesRecursively(filePath, fileMap);
  })
  return fileMap;
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

export function initSourceDirectory() {
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
}