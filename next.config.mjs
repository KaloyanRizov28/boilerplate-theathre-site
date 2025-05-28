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
    // Find the existing rule that handles SVG files.
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Rule to handle SVGs ending with `?url`.
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Rule to handle all other SVG imports.
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // Exclude *.svg?url imports
        use: ['@svgr/webpack'],
      },
    );

    // Modify the original SVG rule to exclude SVGs handled by @svgr/webpack.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;