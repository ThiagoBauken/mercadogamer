const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all page files
const output = execSync(
  'find "c:\\Users\\Thiago\\Desktop\\marketplace\\MercadoGamer\\apps\\web\\pages" -name "index.tsx" -type f | grep -v node_modules | grep -v ".next"',
  { encoding: 'utf-8' }
);

const allPages = output.trim().split('\n').filter(Boolean);

// Skip API routes and _app/_document
const pagesToFix = allPages.filter(page =>
  !page.includes('/api/') &&
  !page.includes('/_app') &&
  !page.includes('/_document')
);

console.log(`Found ${pagesToFix.length} pages to check\n`);

pagesToFix.forEach(fullPath => {
  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already has getServerSideProps or getStaticProps
    if (content.includes('getServerSideProps') || content.includes('getStaticProps')) {
      console.log(`⊘ Skipping ${fullPath} - already has data fetching`);
      return;
    }

    // Determine which namespaces to use
    const isDashboardPage = fullPath.includes('/dashboard/');
    const namespaces = isDashboardPage ? ['common', 'dashboard'] : ['common'];
    const namespacesStr = JSON.stringify(namespaces);

    // Check if serverSideTranslations is imported
    if (!content.includes('serverSideTranslations')) {
      // Add import after NextPage import
      if (content.includes("import { NextPage } from 'next/app';")) {
        content = content.replace(
          "import { NextPage } from 'next/app';",
          "import { NextPage } from 'next/app';\nimport { serverSideTranslations } from 'next-i18next/serverSideTranslations';"
        );
      } else if (content.includes("import { NextPage } from 'next';")) {
        content = content.replace(
          "import { NextPage } from 'next';",
          "import { NextPage } from 'next';\nimport { serverSideTranslations } from 'next-i18next/serverSideTranslations';"
        );
      } else {
        // Just add it at the top after the first import
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import')) {
            lines.splice(i + 1, 0, "import { serverSideTranslations } from 'next-i18next/serverSideTranslations';");
            break;
          }
        }
        content = lines.join('\n');
      }
    }

    // Add getServerSideProps before export default
    content = content.replace(
      /export default (\w+);/,
      `export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ${namespacesStr})),
    },
  };
}

export default $1;`
    );

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed ${fullPath}`);
  } catch (error) {
    console.log(`✗ Error with ${fullPath}:`, error.message);
  }
});

console.log('\nDone!');
