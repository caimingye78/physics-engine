import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 相对 base: 产物在 GitHub Pages 的任意子路径(/<repo>/)下都能正确加载资源。
// outDir=docs: 直接构建到 docs/, 配合 "Deploy from a branch (main, /docs)" 发布,
//   无需任何 GitHub Actions 工作流(规避账号的 Action 必须 SHA 固定策略)。
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'docs',
    chunkSizeWarningLimit: 2000,
  },
});
