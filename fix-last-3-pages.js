const fs = require('fs');

const pages = [
  'apps/web/pages/dashboard/inventory/[id]/index.tsx',
  'apps/web/pages/dashboard/qas/index.tsx',
  'apps/web/pages/dashboard/sale/[id]/index.tsx'
];

pages.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("dynamic(() => import")) {
    console.log(`⊘ Skipping ${filePath}`);
    return;
  }
  
  if (!content.includes("import dynamic from")) {
    content = content.replace(
      "import { NextPage } from 'next';",
      "import { NextPage } from 'next';\nimport dynamic from 'next/dynamic';"
    );
  }
  
  content = content.replace(
    "import { OrderDetailPageContent } from '@dashboard/order-detail';",
    ""
  );
  
  content = content.replace(
    "import { QAsPageContent } from '@dashboard/qas';",
    ""
  );
  
  content = content.replace(
    /(const\s+\w+:\s*NextPage\s*=)/,
    "const OrderDetailPageContent = dynamic(() => import('@dashboard/order-detail').then(mod => mod.OrderDetailPageContent), { ssr: false });\nconst QAsPageContent = dynamic(() => import('@dashboard/qas').then(mod => mod.QAsPageContent), { ssr: false });\n\n$1"
  );
  
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${filePath}`);
});

console.log('Done!');
