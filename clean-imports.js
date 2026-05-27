const fs = require('fs');

const pages = [
  'apps/web/pages/dashboard/qas/index.tsx',
  'apps/web/pages/dashboard/sale/[id]/index.tsx'
];

pages.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove unused QAsPageContent or OrderDetailPageContent imports that appear twice
  const lines = content.split('\n');
  const cleaned = [];
  let foundDynamic = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const QAsPageContent = dynamic') || lines[i].includes('const OrderDetailPageContent = dynamic')) {
      if (!foundDynamic) {
        cleaned.push(lines[i]);
        foundDynamic = true;
      }
    } else {
      cleaned.push(lines[i]);
    }
  }
  
  content = cleaned.join('\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Cleaned ${filePath}`);
});

console.log('Done!');
