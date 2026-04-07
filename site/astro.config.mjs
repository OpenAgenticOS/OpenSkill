import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL || "https://openagenticos.github.io";
const base = process.env.BASE_PATH || "/OpenSkill";

export default defineConfig({
  site,
  base,
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
