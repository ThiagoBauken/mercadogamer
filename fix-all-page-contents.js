const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all pages with static page-content imports
const result = execSync(
  `grep -r "from '@page-contents" apps/web/pages --include="*.tsx" | grep -v "dynamic" | grep "import {" | cut -d: -f1 | sort -u`,
  { encoding: 'utf8' }
);

const files = result.trim().split('\n').filter(Boolean);

console.log(`Found ${files.length} files with static page-content imports\n`);

files.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`✗ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = false;

    // Add dynamic import if not present
    if (!content.includes("import dynamic from 'next/dynamic';")) {
      content = content.replace(
        "import { NextPage } from 'next';",
        "import { NextPage } from 'next';\nimport dynamic from 'next/dynamic';"
      );
      changesMade = true;
    }

    // Find all static imports from '@page-contents' or '@web/page-contents'
    const importRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"](@page-contents[^'"]*|@web\/page-contents[^'"]*)['"]\s*;/g;

    let match;
    const imports = [];
    while ((match = importRegex.exec(content)) !== null) {
      const componentNames = match[1].split(',').map(s => s.trim());
      const importPath = match[2];
      imports.push({ componentNames, importPath, fullMatch: match[0] });
    }

    imports.forEach(({ componentNames, importPath, fullMatch }) => {
      // Remove the static import
      content = content.replace(fullMatch, '');
      changesMade = true;

      // Add dynamic imports for each component
      componentNames.forEach(componentName => {
        const dynamicImport = `const ${componentName} = dynamic(() => import('${importPath}').then(mod => mod.${componentName}), { ssr: false });`;

        // Find the position to insert (before the first component/function definition)
        const insertPattern = /(const\s+\w+:\s*NextPage\s*=|function\s+\w+|export\s+default)/;
        const insertMatch = content.match(insertPattern);

        if (insertMatch) {
          const insertPos = content.indexOf(insertMatch[0]);
          content = content.slice(0, insertPos) + '\n' + dynamicImport + '\n\n' + content.slice(insertPos);
        }
      });
    });

    if (changesMade) {
      // Clean up multiple empty lines
      content = content.replace(/\n{3,}/g, '\n\n');

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Fixed ${filePath}`);
    } else {
      console.log(`⊘ No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
