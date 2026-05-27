const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all page-content files
const files = execSync(
  `find apps/web/src/page-contents -name "*.tsx" -type f`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

console.log(`Checking ${files.length} page-content files for static imports\n`);

let fixedCount = 0;

files.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Skip if already has many dynamic imports (likely already fixed)
    const dynamicCount = (content.match(/dynamic\s*\(/g) || []).length;

    // Check for static component imports from @components, @widgets, or relative paths
    const staticImportPattern = /import\s+{\s*([^}]+)\s*}\s+from\s+['"](@components\/[^'"]+|@widgets\/[^'"]+|\.\.?\/[^'"]+components[^'"]*)['"]\s*;/g;

    let match;
    const importsToConvert = [];

    while ((match = staticImportPattern.exec(content)) !== null) {
      const components = match[1].split(',').map(c => c.trim());
      const importPath = match[2];
      importsToConvert.push({ components, importPath, fullMatch: match[0] });
    }

    if (importsToConvert.length === 0) {
      return;
    }

    // Add dynamic import if not present
    if (!content.includes("import dynamic from 'next/dynamic';")) {
      // Find a good place to add it (after react imports)
      if (content.includes("import { useEffect")) {
        content = content.replace(
          /(import\s+{[^}]*}\s+from\s+['"]react['"];?)/,
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
    importsToConvert.forEach(({ components, importPath, fullMatch }) => {
      // Remove the static import
      content = content.replace(fullMatch, '');

      // Add dynamic imports for each component
      const dynamicImports = components.map(comp => {
        const cleanComp = comp.trim();
        return `const ${cleanComp} = dynamic(() => import('${importPath}').then(mod => mod.${cleanComp}), { ssr: false });`;
      }).join('\n');

      // Find export statement to insert before
      const exportMatch = content.match(/export\s+(const|function|class)/);
      if (exportMatch) {
        const insertPos = content.indexOf(exportMatch[0]);
        content = content.slice(0, insertPos) + '\n' + dynamicImports + '\n\n' + content.slice(insertPos);
      } else {
        // Fallback: add after imports
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

console.log(`\nFixed ${fixedCount} files with static component imports`);
