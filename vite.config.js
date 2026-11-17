import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// npm run build: site para a Cloudflare Pages (pasta dist).
// npm run build:preview: um HTML único, só para a prévia.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'singlefile' ? [react(), viteSingleFile()] : [react()],
}));
