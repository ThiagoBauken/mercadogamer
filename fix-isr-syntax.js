const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all page files
const output = execSync(
  'find "c:\\Users\\Thiago\\Desktop\\marketplace\\MercadoGamer\\apps\\web\\pages" -name "*.tsx" -type f | grep -v node_modules | grep -v ".next" | grep -v "_app" | grep -v "_document" | grep -v "api"',
  { encoding: 'utf-8' }
);

const allPages = output.trim().split('\n').filter(Boolean);

console.log(`Fixing ${allPages.length} pages\n`);

allPages.forEach(fullPath => {
  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Fix the extra comma issue
    content = content.replace(
      /\},\s+,\s+revalidate:/g,
      '},\n    revalidate:'
    );

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed ${fullPath}`);
  } catch (error) {
    console.log(`✗ Error with ${fullPath}:`, error.message);
  }
});

console.log('\nDone!');
