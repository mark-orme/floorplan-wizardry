
import { defineConfig } from "vite";
import path from "path";
import { mergeConfig } from "vite";
import baseConfig from "./vite.config";

// Enhance the base configuration with additional path aliases
export default mergeConfig(
  baseConfig,
  defineConfig({
    resolve: {
      alias: {
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/hooks": path.resolve(__dirname, "./src/hooks"),
        "@/utils": path.resolve(__dirname, "./src/utils"),
        "@/constants": path.resolve(__dirname, "./src/constants"),
        "@/types": path.resolve(__dirname, "./src/types"),
        "@/contexts": path.resolve(__dirname, "./src/contexts"),
        "@/lib": path.resolve(__dirname, "./src/lib"),
        "@/store": path.resolve(__dirname, "./src/store"),
      },
    },
  })
);
