import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    visualizer({ open: true, filename: 'bundle-report.html' })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      },
      '/ws-api': {
        target: 'ws://localhost:8087',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws-api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const p = id.replace(/\\/g, '/');

          if (p.includes('node_modules/@ant-design/icons')) {
            return 'antd-icons';
          }

          if (p.includes('node_modules/@ant-design/cssinjs')) {
            return 'antd-cssinjs';
          }

          if (p.includes('node_modules/@ant-design')) {
            return 'ant-design';
          }

          if (p.includes('node_modules/@rc-component')) {
            return 'antd-rc';
          }

          if (p.includes('node_modules') && p.includes('/rc-')) {
            return 'antd-rc';
          }

          if (p.includes('node_modules/antd')) {
            return 'antd-vendor';
          }

          if (p.includes('node_modules/@tiptap')) {
            return 'tiptap-core';
          }

          if (p.includes('node_modules/prosemirror')) {
            return 'prosemirror-vendor';
          }

          if (p.includes('node_modules/yjs') || p.includes('node_modules/y-protocols')) {
            return 'yjs-vendor';
          }

          if (p.includes('node_modules/ahooks') || p.includes('node_modules/axios')) {
            return 'utils-vendor';
          }

          if (p.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
