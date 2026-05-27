const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all component files
const files = execSync(
  `find apps/web/src/components -name "*.tsx" -type f`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

console.log(`Checking ${files.length} component files for static widget imports\n`);

let fixedCount = 0;

files.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Check for static widget imports
    const staticWidgetPattern = /import\s+{([^}]+)}\s+from\s+['"]@widgets\/([^'"]+)['"];?/g;

    let match;
    const importsToConvert = [];

    while ((match = staticWidgetPattern.exec(content)) !== null) {
      const components = match[1].split(',').map(c => c.trim());
      const widgetPath = `@widgets/${match[2]}`;
      importsToConvert.push({ components, widgetPath, fullMatch: match[0] });
    }

    if (importsToConvert.length === 0) {
      return;
    }

    // Add dynamic import if not present
    if (!content.includes("import dynamic from 'next/dynamic';")) {
      // Find a good place to add it (after react imports)
      if (content.includes("import { ")) {
        content = content.replace(
          /(import\s+{[^}]*}\s+from\s+['"]react[^'"]*['"];?)/,
          "$1\nimport dynamic from 'next/dynamic';"
        );
      } else if (content.includes("import React")) {
        content = content.replace(
          /(import React[^;]*;)/,
          "$1\nimport dynamic from 'next/dynamic';"
        );
      } else {
        // Add at the top after the first import
        content = content.replace(
          /(import[^;]+;)/,
          "$1\nimport dynamic from 'next/dynamic';"
        );
      }
      changed = true;
    }

    // Convert each static import to dynamic
    importsToConvert.forEach(({ components, widgetPath, fullMatch }) => {
      // Remove the static import
      content = content.replace(fullMatch, '');

      // Add dynamic imports for each component
      const dynamicImports = components.map(comp => {
        const cleanComp = comp.trim();
        return `const ${cleanComp} = dynamic(() => import('${widgetPath}').then(mod => mod.${cleanComp}), { ssr: false });`;
      }).join('\n');

      // Find a good place to insert (before the type definitions or component)
      const typeMatch = content.match(/type\s+\w+\s*=/);
      const componentMatch = content.match(/const\s+\w+:\s*React\.FC/);
      const insertMatch = typeMatch || componentMatch;

      if (insertMatch) {
        const insertPos = content.indexOf(insertMatch[0]);
        content = content.slice(0, insertPos) + '\n' + dynamicImports + '\n\n' + content.slice(insertPos);
      } else {
        // Fallback: add after imports section
        const lastImport = content.lastIndexOf('import ');
        if (lastImport !== -1) {
          const lineEnd = content.indexOf('\n', lastImport);
          content = content.slice(0, lineEnd + 1) + '\n' + dynamicImports + '\n' + content.slice(lineEnd + 1);
        }
      }

      changed = true;
    });

    if (changed) {
      // Clean up multiple empty lines
      content = content.replace(/\n{3,}/g, '\n\n');

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Fixed ${importsToConvert.length} import(s) in ${filePath}`);
      fixedCount++;
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log(`\nFixed ${fixedCount} component files with static widget imports`);
