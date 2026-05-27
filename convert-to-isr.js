const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all page files
const output = execSync(
  'find "c:\\Users\\Thiago\\Desktop\\marketplace\\MercadoGamer\\apps\\web\\pages" -name "*.tsx" -type f | grep -v node_modules | grep -v ".next" | grep -v "_app" | grep -v "_document" | grep -v "api"',
  { encoding: 'utf-8' }
);

const allPages = output.trim().split('\n').filter(Boolean);

console.log(`Found ${allPages.length} pages to convert\n`);

allPages.forEach(fullPath => {
  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if has getServerSideProps
    if (content.includes('export async function getServerSideProps')) {
      // Check if it's a dynamic page (has [...] in path)
      const isDynamic = fullPath.includes('[') && fullPath.includes(']');

      // Convert getServerSideProps to getStaticProps
      content = content.replace(
        /export async function getServerSideProps\(\{ locale \}: \{ locale\??: string \}\) \{/g,
        'export async function getStaticProps({ locale }: { locale?: string }) {'
      );

      // Add revalidate
      content = content.replace(
        /return \{\s+props: \{\s+\.\.\.\(await serverSideTranslations\([^)]+\)\),\s+\},\s+\};/g,
        (match) => {
          return match.replace(
            /\};$/,
            ',\n    revalidate: 60, // ISR: Revalidar a cada 60 segundos\n  };'
          );
        }
      );

      // If dynamic page, add getStaticPaths
      if (isDynamic && !content.includes('getStaticPaths')) {
        content = content.replace(
          /export async function getStaticProps/,
          `export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand
  };
}

export async function getStaticProps`
        );
      }

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Converted ${fullPath}`);
    } else {
      console.log(`⊘ Skipping ${fullPath} - no getServerSideProps`);
    }
  } catch (error) {
    console.log(`✗ Error with ${fullPath}:`, error.message);
  }
});

console.log('\nDone!');
