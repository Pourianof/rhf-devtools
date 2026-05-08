import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true, // Insert entry for types
      rollupTypes: true, // Bundle types into single file
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/rhfDevTools.tsx"),
      name: "RHFDevTools",
      formats: ["es", "cjs", "umd"], // Multiple formats
      fileName: (format) => {
        switch (format) {
          case "es":
            return "index.esm.js";
          case "cjs":
            return "index.js";
          case "umd":
            return "index.umd.js";
          default:
            return `index.${format}.js`;
        }
      },
    },
    rollupOptions: {
      // External dependencies (not bundled)
      external: [
        "react",
        "react-dom",
        "react-hook-form",
        "react/jsx-runtime",
        "react-hook-form",
        "react-icons/md",
        "react-icons/fa",
        "react-icons/fi",
      ],
      output: {
        // Global variables for UMD build
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react-hook-form": "ReactHookForm",
          "react-icons/md": "ReactIconsMd",
          "react-icons/fa": "ReactIconsFa",
          "react-icons/fi": "ReactIconsFi",
        },
        // Preserve modules structure
        preserveModules: false,
        // Source maps
        sourcemap: true,
      },
    },
    // Minify output (optional for production)
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Target browsers
    target: "es2020",
    // Output directory
    outDir: "dist",
    // Empty output directory before build
    emptyOutDir: true,
  },
  // CSS configuration
  css: {
    modules: false,
    preprocessorOptions: {
      // If using Sass
      scss: {
        additionalData: "",
      },
    },
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-hook-form", "react-icons"],
  },
  // Define environment variables
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
});
