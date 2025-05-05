// astro.config.mjs
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
  base: '/docs',
  
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
  
  // Add redirects for doubled paths
  redirects: {
    '/docs/docs/:path': '/docs/:path',
    '/docs/api/:path': '/api/:path',
    '/docs/help/:path': '/help/:path'
  }
});