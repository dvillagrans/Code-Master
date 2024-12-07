

import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/";
// https://astro.build/config
export default defineConfig({

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: 'static',
  adapter: vercel({
    runtime: 'nodejs18.x'
  }),
});
