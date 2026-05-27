const fs = require('fs');
const path = require('path');

const files = [
  'apps/web/src/page-contents/dashboard/balance/index.tsx',
  'apps/web/src/page-contents/dashboard/order-detail/index.tsx',
  'apps/web/src/page-contents/dashboard/order-detail/widgets/chat/index.tsx',
  'apps/web/src/page-contents/dashboard/sale/index.tsx',
  'apps/web/src/page-contents/dashboard/shopping/index.tsx',
  'apps/web/src/page-contents/dashboard/store/index.tsx',
  'apps/web/src/page-contents/dashboard/support/index.tsx',
];

console.log(`Fixing dynamic imports in ${files.length} files\n`);

files.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`✗ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = false;

    // Find all dynamic imports without ssr: false
    const dynamicImportPattern = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\([^)]+\)\);/g;

    content = content.replace(dynamicImportPattern, (match) => {
      // Skip if already has ssr: false or any config object
      if (match.includes('{')) {
        return match;
      }
      changesMade = true;
      // Add ssr: false before the closing parenthesis and semicolon
      return match.replace(/\);$/, ', { ssr: false });');
    });

    if (changesMade) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Fixed dynamic imports in ${filePath}`);
    } else {
      console.log(`⊘ No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
