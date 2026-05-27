const fs = require('fs');
const path = require('path');

// Páginas restantes com os nomes CORRETOS dos componentes
const pages = [
  { path: 'apps/web/pages/dashboard/inventory/[id]/index.tsx', content: 'ProductDetailPageContent', from: '@dashboard/product-detail' },
  { path: 'apps/web/pages/dashboard/profile/index.tsx', content: 'ProfilePageContent', from: '@dashboard/profile' },
  { path: 'apps/web/pages/dashboard/qas/index.tsx', content: 'QasContent', from: '@dashboard/qas' },
  { path: 'apps/web/pages/dashboard/question/index.tsx', content: 'QuestionPageContent', from: '@dashboard/question' },
  { path: 'apps/web/pages/dashboard/sale/[id]/index.tsx', content: 'SaleDetailPageContent', from: '@dashboard/sale-detail' },
  { path: 'apps/web/pages/dashboard/store/index.tsx', content: 'StorePageContent', from: '@dashboard/store' },
];

console.log(`Fixing ${pages.length} remaining pages\n`);

pages.forEach(page => {
  try {
    const fullPath = path.join('./', page.path);

    if (!fs.existsSync(fullPath)) {
      console.log(`✗ File not found: ${page.path}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Skip if already using dynamic
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

    // Find and replace the static import - be more flexible with regex
    const importPatterns = [
      new RegExp(`import\\s+\\{\\s*${page.content}\\s*\\}\\s+from\\s+'${page.from.replace(/\//g, '\\/')}';`, 'g'),
      new RegExp(`import\\s+\\{\\s*${page.content}\\s*\\}\\s+from\\s+"${page.from.replace(/\//g, '\\/')}";`, 'g'),
    ];

    let found = false;
    for (const importRegex of importPatterns) {
      if (importRegex.test(content)) {
        content = content.replace(importRegex, '');
        found = true;
        break;
      }
    }

    if (found) {
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
      console.log(`⊘ Skipping ${page.path} - import pattern not found (may have different component name)`);
    }
  } catch (error) {
    console.log(`✗ Error with ${page.path}:`, error.message);
  }
});

console.log('\nDone!');
