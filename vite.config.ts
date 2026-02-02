import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = __dirname; // project root

export default defineConfig({
  root: 'public',
  build: {
    outDir: path.resolve(ROOT, 'public-dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(ROOT, 'shared'),
    },
  },
});
