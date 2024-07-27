import fs from "fs";
import path from "path";

const sourceDir = 'public/sources';
const jsonFilePath = 'public/markdown-files.json';

const addToFileMap = (fileMap, key, value) => {
  if (!fileMap[key]) {
    fileMap[key] = [value];
  } else {
    fileMap[key].push(value);
  }
}

function traverseFilesRecursively(dir, fileMap) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8' });
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseFilesRecursively(filePath, fileMap);
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
  return fileMap;
}

export default function createFileMapToJson() {
  const fileMap = {};
  traverseFilesRecursively(sourceDir, fileMap);
  fs.writeFileSync(jsonFilePath, JSON.stringify(fileMap, null, 2), { encoding: 'utf-8' });
}