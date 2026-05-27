const fs = require('fs');
const path = require('path');

const dashboardPages = [
  'apps/web/pages/dashboard/inventory/index.tsx',
  'apps/web/pages/dashboard/inventory/[id]/index.tsx',
  'apps/web/pages/dashboard/inventory/add/index.tsx',
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
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace ['common'] with ['common', 'dashboard']
    if (content.includes("['common']")) {
      content = content.replace(/\['common'\]/g, "['common', 'dashboard']");
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Updated ${filePath}`);
    } else {
      console.log(`Skipping ${filePath} - already has correct namespaces or no getServerSideProps`);
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log('Done!');
