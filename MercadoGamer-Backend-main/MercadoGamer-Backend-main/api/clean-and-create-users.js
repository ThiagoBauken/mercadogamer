const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/mercadogamer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Conectado ao MongoDB');

  const User = mongoose.model('users', new mongoose.Schema({}, { strict: false }));
  const Country = mongoose.model('countries', new mongoose.Schema({}, { strict: false }));

  try {
    // Deletar usuários de teste antigos
    await User.deleteMany({ $or: [
      { email: 'teste@teste.com' },
      { email: 'admin@admin.com' },
      { username: 'testeteste' },
      { username: 'admin' }
    ]});
    console.log('🗑️  Usuários antigos removidos');

    // Buscar um país para usar como referência
    let country = await Country.findOne();

    if (!country) {
      console.log('⚠️  Nenhum país encontrado, criando país padrão...');
      country = await Country.create({ name: 'Brasil', code: 'BR' });
      console.log('✅ País criado');
    }

    // Criar usuário teste
    const hashedPasswordUser = await bcrypt.hash('123456', 10);
    const testUser = await User.create({
      username: 'testeteste',
      emailAddress: 'teste@teste.com',
      password: hashedPasswordUser,
      firstName: 'Usuario',
      lastName: 'Teste',
      enabled: true,
      roles: ['user'],
      country: country._id,
      balance: 0,
      gift: 0,
    });
    console.log('✅ Usuário teste criado:');
    console.log('   Username: testeteste');
    console.log('   Email: teste@teste.com');
    console.log('   Senha: 123456');

    // Criar admin
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      emailAddress: 'admin@admin.com',
      password: hashedPasswordAdmin,
      firstName: 'Administrador',
      lastName: 'Sistema',
      enabled: true,
      roles: ['user', 'seller'],
      country: country._id,
      balance: 0,
      gift: 0,
    });
    console.log('✅ Admin criado:');
    console.log('   Username: admin');
    console.log('   Email: admin@admin.com');
    console.log('   Senha: admin123');

    // Listar todos os usuários
    const allUsers = await User.find({}, 'emailAddress username firstName lastName roles');
    console.log('\n📋 Usuários no banco:');
    allUsers.forEach(u => {
      console.log(`   - ${u.username} (${u.emailAddress}) - roles: ${u.roles ? u.roles.join(', ') : 'N/A'}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    mongoose.connection.close();
    process.exit(1);
  }
}).catch((err) => {
  console.error('❌ Erro ao conectar:', err);
  process.exit(1);
});
