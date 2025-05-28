/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      // This rule tells Turbopack to process SVG files
      // ending in .svg with the @svgr/webpack loader.
      // 'as: *.js' tells Turbopack to treat the output as a JavaScript module.
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // You can add other Next.js config options here if needed.
};

export default nextConfig;