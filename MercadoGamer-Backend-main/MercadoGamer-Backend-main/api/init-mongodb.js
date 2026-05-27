/**
 * Script de Inicialização do MongoDB
 * Conecta ao MongoDB e cria todas as coleções e índices necessários
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Connection string fornecida
const MONGODB_URI = 'mongodb://admin:MercadoGamer2024!@185.215.165.19:3031/mercadogamer?tls=false&authSource=admin';

console.log('🚀 Iniciando script de inicialização do MongoDB...\n');

// Configurar mongoose plugins
const plugins = [
  require('mongoose-unique-validator'),
  require('@meanie/mongoose-to-json'),
];

// Setup global database
global.database = {
  mongodb: {
    mongoose: mongoose,
    plugins: plugins,
  },
};

// Função para normalizar nomes de arquivo
function normalizeFileName(value) {
  return value
    .replace(/\.js$/, '')
    .replace(/\./g, ' ')
    .replace(/_/g, ' ')
    .replace(/\W+(.)/g, function (match, chr) {
      return chr.toUpperCase();
    });
}

async function initializeDatabase() {
  try {
    console.log('📡 Conectando ao MongoDB...');
    console.log(`   Host: 185.215.165.19:3031`);
    console.log(`   Database: mercadogamer\n`);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('✅ Conectado ao MongoDB com sucesso!\n');

    const db = mongoose.connection.db;

    // Listar coleções existentes
    console.log('📋 Verificando coleções existentes...');
    const collections = await db.listCollections().toArray();
    console.log(`   Encontradas: ${collections.length} coleções\n`);

    if (collections.length > 0) {
      console.log('   Coleções atuais:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
      console.log('');
    }

    // Carregar módulos da mesma forma que o app.js
    console.log('🔧 Carregando modelos do sistema...\n');

    global.modules = {};
    const modulesPath = path.join(__dirname, 'modules');
    const moduleDirs = fs.readdirSync(modulesPath);

    for (const moduleCode of moduleDirs) {
      const moduleName = normalizeFileName(moduleCode);
      const modulePath = path.join(modulesPath, moduleCode);

      if (!fs.statSync(modulePath).isDirectory()) continue;

      global.modules[moduleName] = {};
      const moduleFiles = fs.readdirSync(modulePath);

      for (const moduleFile of moduleFiles) {
        // Carregar apenas o arquivo model.js
        if (moduleFile === 'model.js') {
          const moduleLoader = require(path.join(modulePath, moduleFile));
          if (typeof moduleLoader === 'function') {
            moduleLoader(global.modules[moduleName]);
          }
        }
      }
    }

    // Construir modelos
    let modelCount = 0;
    for (const m in global.modules) {
      if (global.modules[m].schema) {
        for (const p of global.database.mongodb.plugins) {
          global.modules[m].schema.plugin(p);
        }
        global.modules[m].model = global.database.mongodb.mongoose.model(
          m,
          global.modules[m].schema
        );
        console.log(`   ✓ Modelo carregado: ${m}`);
        modelCount++;
      }
    }

    console.log(`\n✅ Carregados ${modelCount} modelos\n`);

    // Criar índices
    console.log('🔧 Criando índices...\n');
    let indexCount = 0;

    for (const m in global.modules) {
      if (global.modules[m].model) {
        try {
          await global.modules[m].model.createIndexes();
          const count = await global.modules[m].model.countDocuments();
          console.log(`   ✓ ${m}: ${count} documentos`);
          indexCount++;
        } catch (error) {
          console.log(`   ⚠️  Erro em ${m}:`, error.message);
        }
      }
    }

    console.log(`\n✅ ${indexCount} índices criados/verificados\n`);

    // Verificar administradores
    console.log('👤 Verificando usuários administradores...');
    const Administrator = global.modules.administrators?.model;

    if (Administrator) {
      const adminCount = await Administrator.countDocuments();

      if (adminCount === 0) {
        console.log('   ⚠️  Nenhum administrador encontrado. Criando admin padrão...\n');

        const hashedPassword = await bcrypt.hash('MercadoGamer2024!', 12);

        const adminUser = new Administrator({
          username: 'admin',
          password: hashedPassword,
          roles: ['administrator'],
        });

        await adminUser.save();

        console.log('   ✅ Administrador criado com sucesso!');
        console.log('   👤 Username: admin');
        console.log('   🔑 Senha: MercadoGamer2024!');
        console.log('   ⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');
      } else {
        console.log(`   ✓ Já existem ${adminCount} administrador(es)\n`);
      }
    }

    // Criar país padrão (Brasil)
    console.log('🌎 Verificando países...');
    const Country = global.modules.countries?.model;
    let brasilId = null;

    if (Country) {
      let brasil = await Country.findOne({ name: 'Brasil' });

      if (!brasil) {
        console.log('   Criando país Brasil...');
        brasil = new Country({
          name: 'Brasil',
          code: 'BR',
          currency: 'BRL',
          enabled: true,
        });
        await brasil.save();
        console.log('   ✅ País Brasil criado');
      } else {
        console.log('   ✓ Brasil já existe');
      }

      brasilId = brasil._id;
    }
    console.log('');

    // Verificar usuários
    console.log('👥 Verificando usuários...');
    const User = global.modules.users?.model;

    if (User && brasilId) {
      const userCount = await User.countDocuments();
      console.log(`   ✓ Total de usuários: ${userCount}`);

      // Criar usuário vendedor de exemplo se não existir
      if (userCount === 0) {
        console.log('   Criando usuário vendedor de exemplo...');

        const hashedPassword = await bcrypt.hash('vendedor123', 12);

        const sellerUser = new User({
          username: 'vendedor1',
          emailAddress: 'vendedor@mercadogamer.com',
          password: hashedPassword,
          firstName: 'Vendedor',
          lastName: 'Exemplo',
          roles: ['seller', 'user'],
          enabled: true,
          balance: 0,
          country: brasilId,
        });

        await sellerUser.save();
        console.log('   ✅ Usuário vendedor criado');
      }
    }
    console.log('');

    // Verificar counters
    console.log('🔢 Verificando counters...');
    const Counter = global.modules.counters?.model;

    if (Counter) {
      const counterCount = await Counter.countDocuments();

      if (counterCount === 0) {
        console.log('   Criando counters iniciais...');

        const counters = [
          { name: 'orderId', sequence: 10000 },
          { name: 'ticketId', sequence: 1000 },
          { name: 'userId', sequence: 1000 },
        ];

        await Counter.insertMany(counters);
        console.log('   ✅ Counters criados\n');
      } else {
        console.log(`   ✓ Counters existem: ${counterCount}\n`);
      }
    }

    // Estatísticas finais
    console.log('📊 Estatísticas do Banco de Dados:\n');
    console.log('┌─────────────────────────┬──────────┐');
    console.log('│ Coleção                 │ Docs     │');
    console.log('├─────────────────────────┼──────────┤');

    const stats = [];
    for (const m in global.modules) {
      if (global.modules[m].model) {
        try {
          const count = await global.modules[m].model.countDocuments();
          stats.push({ name: m, count });
        } catch (error) {
          // Ignorar erros
        }
      }
    }

    stats.sort((a, b) => a.name.localeCompare(b.name));

    stats.forEach(stat => {
      const name = stat.name.padEnd(23);
      const count = stat.count.toString().padStart(8);
      console.log(`│ ${name} │ ${count} │`);
    });

    console.log('└─────────────────────────┴──────────┘\n');

    console.log('✅ Inicialização concluída com sucesso!\n');
    console.log('🎉 Banco de dados pronto para uso!\n');
    console.log('📝 Credenciais criadas:');
    console.log('   Admin: admin / MercadoGamer2024!');
    console.log('   Vendedor: vendedor1 / vendedor123\n');

  } catch (error) {
    console.error('❌ Erro durante a inicialização:');
    console.error('   Mensagem:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexão com MongoDB fechada.');
  }
}

// Executar inicialização
initializeDatabase();
