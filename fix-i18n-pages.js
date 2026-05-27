const fs = require('fs');
const path = require('path');

const dashboardPages = [
  'apps/web/pages/dashboard/inventory/index.tsx',
  'apps/web/pages/dashboard/inventory/[id]/index.tsx',
  'apps/web/pages/dashboard/inventory/edit/[id]/index.tsx',
  'apps/web/pages/dashboard/profile/index.tsx',
  'apps/web/pages/dashboard/qas/index.tsx',
  'apps/web/pages/dashboard/question/index.tsx',
  'apps/web/pages/dashboard/sale/index.tsx',
  'apps/web/pages/dashboard/sale/[id]/index.tsx',
  'apps/web/pages/dashboard/store/index.tsx',
  'apps/web/pages/dashboard/support/index.tsx',
  'apps/web/pages/dashboard/order/index.tsx',
  'apps/web/pages/dashboard/order/[id]/index.tsx',
  'apps/web/pages/cart/index.tsx',
];

dashboardPages.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check if getServerSideProps already exists
    if (content.includes('getServerSideProps') || content.includes('getStaticProps')) {
      console.log(`Skipping ${filePath} - already has data fetching`);
      return;
    }

    // Check if serverSideTranslations is imported
    if (!content.includes('serverSideTranslations')) {
      // Add import
      let newContent = content.replace(
        "import { NextPage } from 'next/app';",
        "import { NextPage } from 'next/app';\nimport { serverSideTranslations } from 'next-i18next/serverSideTranslations';"
      );

      if (newContent === content) {
        newContent = content.replace(
          "import { NextPage } from 'next';",
          "import { NextPage } from 'next';\nimport { serverSideTranslations } from 'next-i18next/serverSideTranslations';"
        );
      }

      // Add getServerSideProps before export default
      newContent = newContent.replace(
        /export default (\w+);/,
        `export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  };
}

export default $1;`
      );

      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✓ Fixed ${filePath}`);
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log('Done!');
