import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  build: {
    assetsInlineLimit: 0,
  },
});
