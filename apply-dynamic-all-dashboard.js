const fs = require('fs');
const path = require('path');

// Lista manual de todas as páginas do dashboard e seus page-contents
const pages = [
  { path: 'apps/web/pages/dashboard/balance/index.tsx', content: 'BalancePageContent', from: '@dashboard/balance' },
  { path: 'apps/web/pages/dashboard/inventory/index.tsx', content: 'InventoryContent', from: '@dashboard/inventory' },
  { path: 'apps/web/pages/dashboard/inventory/[id]/index.tsx', content: 'ProductDetailContent', from: '@dashboard/product-detail' },
  { path: 'apps/web/pages/dashboard/inventory/add/index.tsx', content: 'AddProductContent', from: '@dashboard/add-product' },
  { path: 'apps/web/pages/dashboard/inventory/edit/[id]/index.tsx', content: 'EditProductContent', from: '@dashboard/edit-product' },
  { path: 'apps/web/pages/dashboard/order/[id]/index.tsx', content: 'OrderDetailPageContent', from: '@dashboard/order-detail' },
  { path: 'apps/web/pages/dashboard/profile/index.tsx', content: 'ProfileContent', from: '@dashboard/profile' },
  { path: 'apps/web/pages/dashboard/qas/index.tsx', content: 'QasPageContent', from: '@dashboard/qas' },
  { path: 'apps/web/pages/dashboard/question/index.tsx', content: 'QuestionContent', from: '@dashboard/question' },
  { path: 'apps/web/pages/dashboard/sale/index.tsx', content: 'SalePageContent', from: '@dashboard/sale' },
  { path: 'apps/web/pages/dashboard/sale/[id]/index.tsx', content: 'SaleDetailContent', from: '@dashboard/sale-detail' },
  { path: 'apps/web/pages/dashboard/store/index.tsx', content: 'StoreContent', from: '@dashboard/store' },
  { path: 'apps/web/pages/dashboard/support/index.tsx', content: 'SupportPageContent', from: '@dashboard/support' },
];

console.log(`Applying dynamic imports to ${pages.length} dashboard pages\n`);

pages.forEach(page => {
  try {
    const fullPath = path.join('./', page.path);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Skip if already using dynamic for this component
    if (content.includes(`dynamic(() => import('${page.from}')`)) {
      console.log(`⊘ Skipping ${page.path} - already has dynamic import`);
      return;
    }

    // Add dynamic import if not present
    if (!content.includes("import dynamic from 'next/dynamic';")) {
      content = content.replace(
        "import { NextPage } from 'next';",
        "import { NextPage } from 'next';\nimport dynamic from 'next/dynamic';"
      );
    }

    // Find and replace the static import
    const importRegex = new RegExp(`import\\s+\\{\\s*${page.content}\\s*\\}\\s+from\\s+'${page.from.replace(/\//g, '\\/')}';`, 'g');

    if (importRegex.test(content)) {
      content = content.replace(importRegex, '');

      // Add dynamic import before the component
      const dynamicImport = `\nconst ${page.content} = dynamic(() => import('${page.from}').then(mod => mod.${page.content}), {\n  ssr: false,\n});\n`;

      // Insert before the first "const" of the page component
      content = content.replace(
        /(const\s+\w+:\s*NextPage\s*=)/,
        dynamicImport + '\n$1'
      );

      // Clean up multiple empty lines
      content = content.replace(/\n{3,}/g, '\n\n');

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Applied dynamic import to ${page.path}`);
    } else {
      console.log(`⊘ Skipping ${page.path} - import pattern not found`);
    }
  } catch (error) {
    console.log(`✗ Error with ${page.path}:`, error.message);
  }
});

console.log('\nDone!');
