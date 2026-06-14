import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 相对 base: 产物在 GitHub Pages 的任意子路径(/<repo>/)下都能正确加载资源。
//
// 发布策略: 构建产物直接铺到仓库"根目录"(见 package.json 的 postbuild),
//   这样 GitHub Pages 选 "Deploy from a branch (main, / root)" 即可发布,
//   无需任何 Actions 工作流(规避账号的 Action 必须 SHA 固定策略),
//   也不依赖用户去切换 /docs 子目录设置。
//
// 构建流程(可重复, 不自我污染):
//   prebuild  -> 用 index.template.html 还原源入口 index.html(供 Vite 读取)
//   build     -> tsc + vite, 输出到 dist/
//   postbuild -> 把 dist/* 拷到根目录(index.html / assets / 图标), 写 .nojekyll
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
});
