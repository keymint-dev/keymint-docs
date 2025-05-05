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
  
  // Pages configuration
  pages: {
    // Ensure all routes are properly handled
    '/docs/api/*': '/docs/api/index',
    '/docs/api/licenses/*': '/docs/api/licenses/index'
  }
});