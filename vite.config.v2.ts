import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// V2 Configuration - Shopify Integration Build
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081, // Different port for V2 development
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist/v2",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/shopify/index-v2.tsx"),
      name: "FutonQuizReact",
      fileName: "futon-quiz-react-v2",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        // Shopify-compatible asset structure
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `shopify-assets/[name][extname]`;
          }
          if (extType === 'css') {
            return `shopify-assets/futon-quiz-react-v2[extname]`;
          }
          return `shopify-assets/[name][extname]`;
        },
        entryFileNames: 'shopify-assets/futon-quiz-react-v2.js',
      },
    },
    target: 'es2015', // Broader browser support for Shopify
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
}));