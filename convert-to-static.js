const fs = require('fs');
const path = require('path');

// Páginas que podem ser estáticas (não precisam de dados em tempo real)
const staticPages = [
  'apps/web/pages/404/index.tsx',
  'apps/web/pages/help-center/index.tsx',
  'apps/web/pages/help-center/[category]/[topic]/index.tsx',
  'apps/web/pages/icon-lists/index.tsx',
  'apps/web/pages/info-venta/index.tsx',
  'apps/web/pages/security-privacy/[id]/index.tsx',
  'apps/web/pages/term-condition/[id]/index.tsx',
  'apps/web/pages/vendedores/index.tsx',
];

staticPages.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Converter getServerSideProps para getStaticProps
    if (content.includes('getServerSideProps')) {
      content = content.replace(
        /export async function getServerSideProps\(\{ locale \}: \{ locale\??: string \}\) \{/g,
        'export async function getStaticProps({ locale }: { locale?: string }) {'
      );

      // Adicionar revalidate para ISR
      content = content.replace(
        /return \{\s+props: \{\s+\.\.\.\(await serverSideTranslations\(locale \|\| 'pt-BR', \[([^\]]+)\]\)\),\s+\},\s+\};/g,
        `return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', [$1])),
    },
    revalidate: 3600, // Revalidar a cada 1 hora
  };`
      );

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Converted ${filePath} to static`);
    } else {
      console.log(`⊘ Skipping ${filePath} - no getServerSideProps`);
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

// Para páginas dinâmicas com parâmetros, adicionar getStaticPaths
const dynamicPages = [
  'apps/web/pages/help-center/[category]/[topic]/index.tsx',
  'apps/web/pages/security-privacy/[id]/index.tsx',
  'apps/web/pages/term-condition/[id]/index.tsx',
];

dynamicPages.forEach(filePath => {
  try {
    const fullPath = path.join('./', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Adicionar getStaticPaths se não existir
    if (!content.includes('getStaticPaths')) {
      content = content.replace(
        /export async function getStaticProps/,
        `export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps`
      );

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Added getStaticPaths to ${filePath}`);
    }
  } catch (error) {
    console.log(`✗ Error with ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
