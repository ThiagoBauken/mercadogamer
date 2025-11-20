const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/mercadogamer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Conectado ao MongoDB');

  // Schema correto de usuário (baseado no model real)
  const userSchema = new mongoose.Schema({
    emailAddress: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    enabled: { type: Boolean, default: true },
    roles: [{ type: String, enum: ['user', 'seller'] }],
    balance: { type: Number, default: 0 },
    gift: { type: Number, default: 0 },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'countries',
      required: true,
    },
  }, { timestamps: true });

  const User = mongoose.model('users', userSchema);
  const Country = mongoose.model('countries', new mongoose.Schema({}, { strict: false }));

  try {
    // Buscar um país para usar como referência
    let country = await Country.findOne();

    if (!country) {
      console.log('⚠️  Nenhum país encontrado, criando país padrão...');
      country = new Country({ name: 'Brasil', code: 'BR' });
      await country.save();
      console.log('✅ País criado');
    }

    // Criar usuário teste
    const testUsername = 'testeteste';
    const existingUser = await User.findOne({ username: testUsername });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const testUser = new User({
        username: testUsername,
        emailAddress: 'teste@teste.com',
        password: hashedPassword,
        firstName: 'Usuario',
        lastName: 'Teste',
        enabled: true,
        roles: ['user'],
        country: country._id,
      });
      await testUser.save();
      console.log('✅ Usuário teste criado:');
      console.log('   Username: testeteste');
      console.log('   Email: teste@teste.com');
      console.log('   Senha: 123456');
    } else {
      console.log('⚠️  Usuário teste já existe');
    }

    // Criar admin
    const adminUsername = 'admin';
    const existingAdmin = await User.findOne({ username: adminUsername });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: adminUsername,
        emailAddress: 'admin@admin.com',
        password: hashedPassword,
        firstName: 'Administrador',
        lastName: 'Sistema',
        enabled: true,
        roles: ['user', 'seller'],
        country: country._id,
      });
      await admin.save();
      console.log('✅ Admin criado:');
      console.log('   Username: admin');
      console.log('   Email: admin@admin.com');
      console.log('   Senha: admin123');
    } else {
      console.log('⚠️  Admin já existe');
    }

    // Listar todos os usuários
    const allUsers = await User.find({}, 'emailAddress username firstName lastName roles');
    console.log('\n📋 Usuários no banco:');
    allUsers.forEach(u => {
      console.log(`   - ${u.username} (${u.emailAddress}) - roles: ${u.roles.join(', ')}`);
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
