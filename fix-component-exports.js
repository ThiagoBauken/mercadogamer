const fs = require('fs');
const path = require('path');

const componentsToFix = [
  { file: 'apps/web/src/components/notification-menu/index.tsx', export: 'NotificationMenu' },
  { file: 'apps/web/src/components/cart-menu/index.tsx', export: 'CartMenu' },
  { file: 'apps/web/src/components/checkout-header/index.tsx', export: 'CheckoutHeader' },
];

let fixedCount = 0;

componentsToFix.forEach(({ file, export: exportName }) => {
  try {
    const fullPath = path.join('./', file);

    if (!fs.existsSync(fullPath)) {
      console.log(`✗ File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if export already exists
    if (content.includes(`export { ${exportName} }`) || content.includes(`export default ${exportName}`)) {
      console.log(`○ Already exported: ${file}`);
      return;
    }

    // Add export at the end
    content = content.trimEnd() + `\n\nexport { ${exportName} };\n`;

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Added export for ${exportName} in ${file}`);
    fixedCount++;
  } catch (error) {
    console.log(`✗ Error with ${file}:`, error.message);
  }
});

console.log(`\nFixed ${fixedCount} component exports`);
