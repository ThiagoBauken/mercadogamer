// @ts-check

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://mercadogamer.com.br';
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.mercadogamer.com.br';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  sourceDir: 'dist/apps/web/.next',
  outDir: 'dist/apps/web/public/',

  /**
   * additionalPaths — called at build time to inject dynamic product/seller/game URLs.
   * Falls back to empty array on fetch errors so the build never fails.
   */
  additionalPaths: async (config) => {
    const paths = [];

    try {
      // ── Products ────────────────────────────────────────────────────────────
      // Fetch all products (paginado com _perPage=10000)
      const productsRes = await fetch(
        `${serverUrl}/products?_perPage=10000&_fields=id,user`,
      ).catch(() => null);

      if (productsRes && productsRes.ok) {
        const productsJson = await productsRes.json().catch(() => ({ data: { data: [] } }));
        const items = productsJson?.data?.data ?? productsJson?.data ?? productsJson?.items ?? [];

        const sellerUsernames = new Set();

        for (const product of items) {
          if (product?.id) {
            paths.push({
              loc: `/product-detail/${product.id}`,
              changefreq: 'daily',
              priority: 0.8,
              lastmod: new Date().toISOString(),
            });
          }

          // Collect unique seller usernames
          const username =
            typeof product?.user === 'string'
              ? null
              : product?.user?.username;
          if (username) {
            sellerUsernames.add(username);
          }
        }

        // ── Seller pages ─────────────────────────────────────────────────────
        for (const username of sellerUsernames) {
          paths.push({
            loc: `/vendedores/${username}`,
            changefreq: 'weekly',
            priority: 0.6,
            lastmod: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('[next-sitemap] Failed to fetch products:', e?.message ?? e);
    }

    try {
      // ── Games ────────────────────────────────────────────────────────────────
      const gamesRes = await fetch(`${serverUrl}/games`).catch(() => null);

      if (gamesRes && gamesRes.ok) {
        const gamesJson = await gamesRes.json().catch(() => ({ data: [] }));
        const games = gamesJson?.data ?? gamesJson?.items ?? gamesJson ?? [];

        for (const game of Array.isArray(games) ? games : []) {
          if (game?.id) {
            paths.push({
              loc: `/catalogo?game=${game.id}`,
              changefreq: 'weekly',
              priority: 0.5,
              lastmod: new Date().toISOString(),
            });
          }
        }
      }
    } catch (e) {
      console.warn('[next-sitemap] Failed to fetch games:', e?.message ?? e);
    }

    return paths;
  },

  // Static pages always included
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === '/' || path === '/catalogo' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : path === '/catalogo' ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
