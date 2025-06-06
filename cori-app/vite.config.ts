import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});