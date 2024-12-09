import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: 'server',
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      include: ['@monaco-editor/react', 'monaco-editor'],
    },
  },
});
