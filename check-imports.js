const fs = require('fs');
const path = require('path');

// Ler o tsconfig.json para obter os aliases configurados
const tsconfigPath = path.join(__dirname, 'apps', 'web', 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
const configuredAliases = Object.keys(tsconfig.compilerOptions.paths || {});

console.log('🔍 Aliases configurados no tsconfig.json:');
console.log(configuredAliases.map(a => `  - ${a}`).join('\n'));
console.log('\n');

// Função para buscar imports recursivamente
const foundAliases = new Set();
const missingAliases = new Set();

function findImports(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        findImports(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Regex para encontrar imports com @ e caminhos absolutos incorretos
      const importRegex = /from\s+['"]([^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];

        // Verificar se é um caminho absoluto incorreto (apps/web/src/...)
        if (importPath.startsWith('apps/web/src/') || importPath.startsWith('apps/admin/src/')) {
          console.log(`\n❌ ERRO: Caminho absoluto incorreto encontrado!`);
          console.log(`   Arquivo: ${filePath.replace(__dirname, '')}`);
          console.log(`   Import: ${importPath}`);
          console.log(`   Deve usar caminho relativo ou alias do tsconfig.json`);
          continue;
        }

        // Ignorar imports que não começam com @
        if (!importPath.startsWith('@')) continue;

        const alias = importPath.split('/')[0]; // Pegar só a primeira parte (ex: @store de @store/actions)
        foundAliases.add(alias);

        // Verificar se o alias está configurado
        const isConfigured = configuredAliases.some(configured => {
          const configuredBase = configured.replace('/*', '').replace('*', '');
          return importPath === configuredBase ||
                 importPath.startsWith(configuredBase + '/') ||
                 configuredBase === alias ||
                 configuredBase === alias + '/*';
        });

        if (!isConfigured) {
          missingAliases.add({ alias, importPath, file: filePath.replace(__dirname, '') });
        }
      }
    }
  }
}

// Buscar imports no diretório src
const srcPath = path.join(__dirname, 'apps', 'web', 'src');
const pagesPath = path.join(__dirname, 'apps', 'web', 'pages');

console.log('🔍 Analisando imports...\n');
findImports(srcPath);
findImports(pagesPath);

console.log('📦 Aliases encontrados no código:');
const sortedAliases = Array.from(foundAliases).sort();
console.log(sortedAliases.map(a => `  - ${a}`).join('\n'));
console.log(`\nTotal: ${sortedAliases.length} aliases\n`);

if (missingAliases.size > 0) {
  console.log('❌ Aliases FALTANDO no tsconfig.json:\n');
  const grouped = {};
  missingAliases.forEach(item => {
    if (!grouped[item.alias]) {
      grouped[item.alias] = [];
    }
    grouped[item.alias].push(item);
  });

  Object.keys(grouped).sort().forEach(alias => {
    console.log(`\n  ${alias}:`);
    grouped[alias].forEach(item => {
      console.log(`    - ${item.importPath} (em ${item.file})`);
    });
  });

  console.log('\n\n📝 Sugestão de configuração para adicionar ao tsconfig.json:\n');
  Object.keys(grouped).sort().forEach(alias => {
    const example = grouped[alias][0].importPath;
    // Tentar inferir o caminho baseado no padrão
    if (example.includes('/')) {
      const parts = example.split('/');
      const baseAlias = parts[0];
      console.log(`    "${baseAlias}/*": ["./src/${parts.slice(1).join('/')}/*"],`);
    } else {
      console.log(`    "${alias}": ["./src/???"],`);
    }
  });
} else {
  console.log('✅ Todos os aliases estão configurados!\n');
}

// Verificar se existem aliases configurados mas não usados
const unusedAliases = configuredAliases.filter(configured => {
  const base = configured.replace('/*', '').replace('*', '');
  return !sortedAliases.some(found => found === base || base === found + '/*');
});

if (unusedAliases.length > 0) {
  console.log('\n⚠️  Aliases configurados mas não encontrados no código:');
  console.log(unusedAliases.map(a => `  - ${a}`).join('\n'));
}

console.log('\n✨ Análise completa!\n');
