import fs from "fs";
import path from "path";

const markdownPath = 'public/markdown';
const jsonFilePath = 'public/markdown-files.json';

function listFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir, { encoding: 'utf-8' });
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      listFilesRecursively(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(path.relative(markdownPath, filePath).normalize('NFC'));
    }
  });
  return fileList;
}

export default function createFileListToJson() {
  const markdownFiles = listFilesRecursively(markdownPath);
  fs.writeFileSync(jsonFilePath, JSON.stringify(markdownFiles, null, 2), { encoding: 'utf-8' });
}