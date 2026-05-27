/**
 * Script de Teste de Conexão MongoDB
 * Verifica se o MongoDB está acessível e se os dados estão corretos
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://admin:MercadoGamer2024!@185.215.165.19:3031/mercadogamer?tls=false&authSource=admin';

console.log('🧪 Testando conexão com MongoDB...\n');

async function testConnection() {
  try {
    console.log('📡 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 segundos timeout
    });

    console.log('✅ Conexão estabelecida!\n');

    const db = mongoose.connection.db;

    // Listar todas as coleções
    console.log('📋 Coleções no banco de dados:');
    const collections = await db.listCollections().toArray();
    console.log(`   Total: ${collections.length} coleções\n`);

    // Verificar documentos em cada coleção
    console.log('📊 Contagem de documentos:\n');
    console.log('┌──────────────────────────┬───────────┐');
    console.log('│ Coleção                  │ Docs      │');
    console.log('├──────────────────────────┼───────────┤');

    for (const col of collections) {
      try {
        const count = await db.collection(col.name).countDocuments();
        const name = col.name.padEnd(24);
        const docs = count.toString().padStart(9);
        console.log(`│ ${name} │ ${docs} │`);
      } catch (error) {
        console.log(`│ ${col.name.padEnd(24)} │ ERROR     │`);
      }
    }

    console.log('└──────────────────────────┴───────────┘\n');

    // Verificar estrutura de documentos importantes
    console.log('🔍 Verificando integridade dos dados:\n');

    // Administradores
    const admins = await db.collection('administrators').find().toArray();
    console.log(`✓ Administradores: ${admins.length}`);
    if (admins.length > 0) {
      console.log(`  - Username: ${admins[0].username}`);
      console.log(`  - Roles: ${admins[0].roles?.join(', ') || 'N/A'}`);
    }

    // Usuários
    const users = await db.collection('users').find().toArray();
    console.log(`\n✓ Usuários: ${users.length}`);
    if (users.length > 0) {
      console.log(`  - Username: ${users[0].username}`);
      console.log(`  - Email: ${users[0].emailAddress || 'N/A'}`);
      console.log(`  - Roles: ${users[0].roles?.join(', ') || 'N/A'}`);
      console.log(`  - Country: ${users[0].country || 'N/A'}`);
    }

    // Países
    const countries = await db.collection('countries').find().toArray();
    console.log(`\n✓ Países: ${countries.length}`);
    if (countries.length > 0) {
      console.log(`  - Nome: ${countries[0].name}`);
      console.log(`  - Código: ${countries[0].code}`);
      console.log(`  - Moeda: ${countries[0].currency}`);
    }

    // Counters
    const counters = await db.collection('counters').find().toArray();
    console.log(`\n✓ Counters: ${counters.length}`);
    counters.forEach(counter => {
      console.log(`  - ${counter.name}: ${counter.sequence}`);
    });

    // Verificar índices
    console.log('\n\n🔧 Verificando índices importantes:\n');

    // Índices de users
    const userIndexes = await db.collection('users').indexes();
    console.log(`✓ Índices em 'users': ${userIndexes.length}`);
    userIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    // Índices de administrators
    const adminIndexes = await db.collection('administrators').indexes();
    console.log(`\n✓ Índices em 'administrators': ${adminIndexes.length}`);
    adminIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log('\n\n✅ Teste de conexão concluído com sucesso!');
    console.log('🎉 MongoDB está funcionando corretamente!\n');

    // Testar operação de escrita
    console.log('🧪 Testando operação de escrita...');
    const testCollection = db.collection('test_connection');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    const testDoc = await testCollection.findOne({ test: true });
    await testCollection.deleteOne({ _id: testDoc._id });
    console.log('✅ Operação de escrita funcionando!\n');

  } catch (error) {
    console.error('\n❌ ERRO durante o teste:');
    console.error('   Tipo:', error.name);
    console.error('   Mensagem:', error.message);

    if (error.message.includes('authentication')) {
      console.error('\n⚠️  PROBLEMA DE AUTENTICAÇÃO:');
      console.error('   - Verifique usuário e senha');
      console.error('   - Verifique se o banco tem autenticação habilitada');
    }

    if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.error('\n⚠️  PROBLEMA DE CONEXÃO:');
      console.error('   - Verifique se o MongoDB está rodando');
      console.error('   - Verifique o host e porta');
      console.error('   - Verifique firewall/rede');
    }

    console.error('\n   Stack completo:', error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada.\n');
  }
}

testConnection();
