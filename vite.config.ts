import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import svgr from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";
import "dotenv/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tsconfigPaths(), svgr(), eslint({ failOnError: false }), ViteEjsPlugin()],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: { "primary-color": "#0070b3" },
        },
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    build: {
      commonjsOptions: {
        ignoreTryCatch: (id) => id !== "stream",
      },
    },
    resolve: {
      alias: {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
        "antd/es/button": "antd/es/button",
        "antd/es/menu": "antd/es/menu",
        "antd/es/table": "antd/es/table",
      },
    },
  };
});
