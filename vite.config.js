import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'docs');

// https://vitejs.dev/config/
export default defineConfig({
    root,
    plugins: [vue()],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(root, 'index.html'),
          import: resolve(root, 'import.html'),
        }
      }
    }
});
