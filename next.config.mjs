/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration (for 'next dev --turbo')
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack configuration (ESSENTIAL for 'next build' and 'next dev' without --turbo)
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  // Added: Configuration for next/image to optimize images from Firebase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        // You can optionally add port and pathname if you need more specificity,
        // but for general Firebase Storage, hostname is usually sufficient.
        // port: '',
        // pathname: '/v0/b/your-project-id.appspot.com/o/**', // More specific example
      },
      {
        protocol: 'https',
        hostname: 'iennkegfooqahiwwovwb.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Allow external images from the theatre site
      {
        protocol: 'http',
        hostname: 'www.tba.art.bg',
      },
      {
        protocol: 'https',
        hostname: 'www.tba.art.bg',
      },
    ],
  },
};

export default nextConfig;
