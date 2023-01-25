// const withLess = require('next-with-less');
// const withTM = require('next-transpile-modules')(['react-use-scroll-snap']);

module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|ttf)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=43200, must-revalidate',
          }
        ],
      },
    ]
  },
  experimental: {
    scrollRestoration: true
  }
};

// module.exports = withTM(
//   withLess({
//     lessLoaderOptions: {
//       /* ... */
//     },
//   })
// );



