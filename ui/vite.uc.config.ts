import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";
import { loadEnv,Plugin } from "vite";
import { createViteConfig } from "./src/vite/config-builder";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return createViteConfig({
    base:  env.VITE_API_URL + "/uc/",
    entryFile: "/uc-src/main.ts",
    port: 4000,
    outDir: path.resolve("build/dist/uc"),
    mode,
    plugins: [
      VueI18nPlugin({
        include: [path.resolve(__dirname, "./src/locales/*.yaml")],
      }) as Plugin,
    ],
  });
};
