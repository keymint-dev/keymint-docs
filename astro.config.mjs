// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    react()
  ],
  site: 'https://docs.keymint.dev',
  base: '/',
  
  // Ensure assets are properly built
  build: {
    assets: '_astro'
  },
  
  // Adjust output to make links work through rewrite
  output: 'static',
  
  // Configure dev server for CORS
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  // Add this to make it work with both keymint.dev/docs and docs.keymint.dev
  trailingSlash: 'always'
});