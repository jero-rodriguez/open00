import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  resolve: {
    alias: {
      "@module": resolve(__dirname, "src/module"),
      "@utils": resolve(__dirname, "src/module/utils"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/module/vsd.ts"),
      formats: ["es"],
      fileName: () => "module/vsd.js",
    },
    rollupOptions: {
      external: [
        /^foundry/,
        /^@league-of-foundry-developers/,
      ],
    },
  },
  plugins: [
    viteStaticCopy({
      silent: true,
      structured: true,
      targets: [
        {
          src: "system.json",
          dest: ".",
        },
        {
          src: "lang/*.json",
          dest: ".",
        },
        {
          src: "src/templates/**/*.hbs",
          dest: ".",
          rename: { stripBase: 1 },
        },
        {
          src: "assets/**/*",
          dest: ".",
        },
        {
          src: "packs/**/*",
          dest: ".",
        },
        {
          src: "styles/**/*",
          dest: ".",
        },
      ],
    }),
  ],
});
