import { defineConfig } from "vite";
res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  build: {
    assetsInlineLimit: 0,
  },
});
