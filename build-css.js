// build-css.js
import { build } from "vite";
import path from "path";

async function buildCSS() {
  await build({
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/styles/index.css"),
        name: "styles",
        formats: ["es"],
        fileName: () => "styles.js", // Dummy file
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") return "styles.css";
            return assetInfo.name;
          },
        },
      },
      cssCodeSplit: false,
    },
    css: {
      modules: false,
    },
  });
}

buildCSS();
