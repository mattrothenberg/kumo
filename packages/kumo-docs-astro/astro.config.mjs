// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "./integrations/pagefind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
});
