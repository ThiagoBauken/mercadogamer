// const withLess = require('next-with-less');
// const withTM = require('next-transpile-modules')(['react-use-scroll-snap']);

const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  // Usa SWC (compilador nativo do Next 14) para styled-components em vez do Babel
  compiler: {
    styledComponents: true,
  },
  // Transpile TypeScript packages from monorepo libs
  transpilePackages: ['ui-shared'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // NOTE: `outputFileTracing: false` was removed — it is not a valid top-level
  // Next.js 14 option. If you need to disable output file tracing for Docker
  // builds, set `experimental.outputFileTracingRoot` instead.
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
