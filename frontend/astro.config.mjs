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
  output: 'server', // Cambiar 'hybrid' a 'server' o 'static'
  adapter: vercel(), // Usa el adaptador adecuado para el despliegue
  vite: {
    optimizeDeps: {
      include: ['@monaco-editor/react', 'monaco-editor'],
    },
  },
  experimental: {
    // Verifica si 'viewTransitions' sigue siendo válido en tu versión
    // Si no es compatible, elimina esta sección
  },
});
