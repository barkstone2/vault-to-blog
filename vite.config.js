import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateHtmlFiles from "./src/generateHtml.js";
import {
  createFileMapToJson,
  createImageMapToJson, initSourceDirectory,
} from "./src/utils/file/fileUtils.js";

initSourceDirectory()
createFileMapToJson()
createImageMapToJson()
await generateHtmlFiles()

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
  }
})
