import fs from "fs";
import path from "path";
import mime from "mime";

const sourceDir = 'public/sources';
const imageJsonFilePath = 'public/image-files.json';

const addToFileMap = (fileMap, key, value) => {
  if (!fileMap[key]) {
    fileMap[key] = [value];
  } else {
    fileMap[key].push(value);
  }
}

export function getFileMap() {
  const fileListJson = fs.readFileSync('public/markdown-files.json', 'utf-8');
  return JSON.parse(fileListJson);
}

export const imageFileMap = (() => {
  const imageFileMap = fs.readFileSync(imageJsonFilePath, 'utf-8');
  return JSON.parse(imageFileMap);
});

function traverseImageRecursively(dir, fileMap) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8' });
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const mimeType = mime.getType(file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseImageRecursively(filePath, fileMap);
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
  return fileMap;
}

export function createImageMapToJson() {
  const imageFileMap = {};
  traverseImageRecursively(sourceDir, imageFileMap);
  fs.writeFileSync(imageJsonFilePath, JSON.stringify(imageFileMap, null, 2), { encoding: 'utf-8' });
}