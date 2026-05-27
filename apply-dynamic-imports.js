const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all dashboard page files
const output = execSync(
  'find "c:\\Users\\Thiago\\Desktop\\marketplace\\MercadoGamer\\apps\\web\\pages\\dashboard" -name "index.tsx" -type f | grep -v node_modules | grep -v ".next"',
  { encoding: 'utf-8' }
);

const dashboardPages = output.trim().split('\n').filter(Boolean);

console.log(`Applying dynamic imports to ${dashboardPages.length} dashboard pages\n`);

dashboardPages.forEach(fullPath => {
  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Skip if already using dynamic
    if (content.includes("dynamic(() => import('@")) {
      console.log(`⊘ Skipping ${fullPath} - already has dynamic import`);
      return;
    }

    // Find imports of page-content components
    const importRegex = /import\s+\{\s*(\w+)\s*\}\s+from\s+'@dashboard\/([^']+)';/g;
    const matches = [...content.matchAll(importRegex)];

    if (matches.length === 0) {
      console.log(`⊘ Skipping ${fullPath} - no dashboard imports found`);
      return;
    }

    // Add dynamic import at the top if not present
    if (!content.includes("import dynamic from 'next/dynamic';")) {
      content = content.replace(
        "import { NextPage } from 'next';",
        "import { NextPage } from 'next';\nimport dynamic from 'next/dynamic';"
      );
    }

    // Convert each page-content import to dynamic
    matches.forEach(match => {
      const componentName = match[1];
      const modulePath = match[2];

      // Remove original import
      content = content.replace(match[0], '');

      // Add dynamic import before the component definition
      const dynamicImport = `\nconst ${componentName} = dynamic(() => import('@dashboard/${modulePath}').then(mod => mod.${componentName}), {\n  ssr: false,\n});\n`;

      // Insert before the page component
      content = content.replace(
        /const \w+: NextPage = /,
        dynamicImport + '\nconst '+ fullPath.match(/[^/\\]+(?=\/index\.tsx$)/)[0].charAt(0).toUpperCase() + fullPath.match(/[^/\\]+(?=\/index\.tsx$)/)[0].slice(1) + ': NextPage = '
      );
    });

    // Clean up multiple empty lines
    content = content.replace(/\n{3,}/g, '\n\n');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Applied dynamic import to ${fullPath}`);
  } catch (error) {
    console.log(`✗ Error with ${fullPath}:`, error.message);
  }
});

console.log('\nDone!');
