import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import generateHtmlFiles from "./src/generateHtml.js";
import {createFileMapToJson, createImageMapToJson, initSourceDirectory,} from "./src/utils/file/fileUtils.js";
import {viteStaticCopy} from "vite-plugin-static-copy";

initSourceDirectory()
createFileMapToJson()
createImageMapToJson()
await generateHtmlFiles()

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/*',
          dest: '',
        }
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
  }
})
