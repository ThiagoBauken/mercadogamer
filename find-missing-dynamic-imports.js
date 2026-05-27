const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript files
const files = execSync(
  `find apps/web/src -name "*.tsx" -o -name "*.ts"`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

console.log(`Checking ${files.length} files for missing dynamic imports\n`);

let fixedCount = 0;
const problematicFiles = [];

files.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if file has dynamic() calls
    const hasDynamicCalls = /\bdynamic\s*\(/.test(content);

    // Check if file has dynamic import
    const hasDynamicImport = /import\s+dynamic\s+from\s+['"]next\/dynamic['"]/.test(content);

    if (hasDynamicCalls && !hasDynamicImport) {
      problematicFiles.push(filePath);

      // Add dynamic import after the first import statement
      if (/^import\s+/m.test(content)) {
        // Find the position after first import block
        const lines = content.split('\n');
        let insertIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          if (/^import\s+/.test(lines[i])) {
            insertIndex = i + 1;
            // Continue to find the end of import block
            while (insertIndex < lines.length && /^import\s+/.test(lines[insertIndex])) {
              insertIndex++;
            }
            break;
          }
        }

        if (insertIndex !== -1) {
          lines.splice(insertIndex, 0, "import dynamic from 'next/dynamic';");
          content = lines.join('\n');

          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✓ Added dynamic import to ${filePath}`);
          fixedCount++;
        }
      }
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log(`\n${problematicFiles.length} files had missing dynamic imports`);
console.log(`Fixed ${fixedCount} files`);

if (problematicFiles.length > 0) {
  console.log('\nProblematic files:');
  problematicFiles.forEach(f => console.log(`  - ${f}`));
}
