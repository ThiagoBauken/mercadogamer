const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/mercadogamer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Conectado ao MongoDB');

  // Schema de usuário (simplificado)
  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    role: String,
    enabled: { type: Boolean, default: true },
  }, { timestamps: true });

  const User = mongoose.model('users', userSchema);

  // Criar usuário comum
  const testUserEmail = 'teste@teste.com';
  const existingUser = await User.findOne({ email: testUserEmail });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const testUser = new User({
      email: testUserEmail,
      password: hashedPassword,
      name: 'Usuario Teste',
      role: 'user',
      enabled: true,
    });
    await testUser.save();
    console.log('✅ Usuário teste criado:');
    console.log('   Email: teste@teste.com');
    console.log('   Senha: 123456');
  } else {
    console.log('⚠️  Usuário teste já existe');
  }

  // Criar admin
  const adminEmail = 'admin@admin.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador',
      role: 'administrator',
      enabled: true,
    });
    await admin.save();
    console.log('✅ Admin criado:');
    console.log('   Email: admin@admin.com');
    console.log('   Senha: admin123');
  } else {
    console.log('⚠️  Admin já existe');
  }

  // Listar todos os usuários
  const allUsers = await User.find({}, 'email name role');
  console.log('\n📋 Usuários no banco:');
  allUsers.forEach(u => {
    console.log(`   - ${u.email} (${u.role})`);
  });

  mongoose.connection.close();
  console.log('\n✅ Concluído!');
  process.exit(0);
}).catch((err) => {
  console.error('❌ Erro ao conectar:', err);
  process.exit(1);
});
