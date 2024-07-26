import fs from "fs";

export function getFileMap() {
  const fileListJson = fs.readFileSync('public/markdown-files.json', 'utf-8');
  return JSON.parse(fileListJson);
}