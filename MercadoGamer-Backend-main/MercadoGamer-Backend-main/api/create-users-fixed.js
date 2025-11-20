const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/mercadogamer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Conectado ao MongoDB');

  // Schema de usuário (completo baseado no model real)
  const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    username: { type: String, unique: true, sparse: true },
    role: { type: String, default: 'user' },
    enabled: { type: Boolean, default: true },
  }, { timestamps: true });

  const User = mongoose.model('users', userSchema);

  try {
    // Criar admin
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador',
        username: 'admin',
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
    const allUsers = await User.find({}, 'email name username role');
    console.log('\n📋 Usuários no banco:');
    allUsers.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - username: ${u.username || 'N/A'}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}).catch((err) => {
  console.error('❌ Erro ao conectar:', err);
  process.exit(1);
});
