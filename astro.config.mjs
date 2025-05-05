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
  
  // Build configuration
  build: {
    assets: '_astro'
  },
  
  // Output configuration
  output: 'static',
  
  // Server configuration
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  // Trailing slash configuration
  trailingSlash: 'always',
  
  // Fix redirects to handle paths properly
  redirects: {
    '/docs/:path': '/:path',
    '/api/:path': '/api/:path',
    '/help/:path': '/help/:path'
  }
});