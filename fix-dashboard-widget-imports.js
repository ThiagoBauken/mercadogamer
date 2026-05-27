const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    path: 'apps/web/src/page-contents/dashboard/edit-product/index.tsx',
    widgets: ['EditCard']
  },
  {
    path: 'apps/web/src/page-contents/dashboard/qas/index.tsx',
    widgets: ['QasContent']
  },
  {
    path: 'apps/web/src/page-contents/dashboard/question/index.tsx',
    widgets: ['QuestionContent', 'ProductContent']
  },
  {
    path: 'apps/web/src/page-contents/dashboard/sale/index.tsx',
    widgets: ['StatusCountCard', 'SaleDetailCard']
  },
  {
    path: 'apps/web/src/page-contents/dashboard/shopping/index.tsx',
    widgets: ['OrderDetailCard', 'ShoppingCard']
  },
  {
    path: 'apps/web/src/page-contents/dashboard/store/index.tsx',
    widgets: ['StoreInformationCard']
  },
];

console.log(`Fixing ${filesToFix.length} dashboard page-contents\n`);

filesToFix.forEach(({ path: filePath, widgets }) => {
  try {
    const fullPath = path.join('./', filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`✗ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already using dynamic imports for these widgets
    if (widgets.some(widget => content.includes(`const ${widget} = dynamic`))) {
      console.log(`⊘ Skipping ${filePath} - already has dynamic imports`);
      return;
    }

    // Add dynamic import if not present
    if (!content.includes("import dynamic from 'next/dynamic';")) {
      content = content.replace(
        /import React/,
        "import dynamic from 'next/dynamic';\nimport React"
      );
    }

    // Find and remove the static import line
    const widgetList = widgets.join(', ');
    const importRegex = new RegExp(`import\\s+\\{\\s*${widgets.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*,\\s*')}\\s*\\}\\s+from\\s+['"]\\.\/widgets['"];?`, 'g');

    content = content.replace(importRegex, '');

    // Add dynamic imports for each widget
    const dynamicImports = widgets.map(widget =>
      `const ${widget} = dynamic(() => import('./widgets').then(mod => mod.${widget}), { ssr: false });`
    ).join('\n');

    // Find a good place to insert (after other imports)
    const exportPattern = /export\s+(const|function)/;
    const exportMatch = content.match(exportPattern);

    if (exportMatch) {
      const insertPos = content.indexOf(exportMatch[0]);
      content = content.slice(0, insertPos) + '\n' + dynamicImports + '\n\n' + content.slice(insertPos);
    }

    // Clean up multiple empty lines
    content = content.replace(/\n{3,}/g, '\n\n');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed ${filePath}`);
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
