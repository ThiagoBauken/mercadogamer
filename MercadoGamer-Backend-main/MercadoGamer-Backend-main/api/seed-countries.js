// Script para popular o banco de dados com países iniciais
// Execute com: node seed-countries.js

const mongoose = require('mongoose');
require('dotenv').config();

const countries = [
  {
    name: 'Argentina',
    currency: 'ARS',
    code: 'AR',
    phoneCode: '+54',
    flag: '🇦🇷',
    processingFee: 0,
    toUSD: 0.001, // 1 ARS = ~0.001 USD (atualizar depois)
  },
  {
    name: 'Brasil',
    currency: 'BRL',
    code: 'BR',
    phoneCode: '+55',
    flag: '🇧🇷',
    processingFee: 0,
    toUSD: 0.20, // 1 BRL = ~0.20 USD
  },
  {
    name: 'Chile',
    currency: 'CLP',
    code: 'CL',
    phoneCode: '+56',
    flag: '🇨🇱',
    processingFee: 0,
    toUSD: 0.0011, // 1 CLP = ~0.0011 USD
  },
  {
    name: 'Colombia',
    currency: 'COP',
    code: 'CO',
    phoneCode: '+57',
    flag: '🇨🇴',
    processingFee: 0,
    toUSD: 0.00025, // 1 COP = ~0.00025 USD
  },
  {
    name: 'México',
    currency: 'MXN',
    code: 'MX',
    phoneCode: '+52',
    flag: '🇲🇽',
    processingFee: 0,
    toUSD: 0.059, // 1 MXN = ~0.059 USD
  },
  {
    name: 'Perú',
    currency: 'PEN',
    code: 'PE',
    phoneCode: '+51',
    flag: '🇵🇪',
    processingFee: 0,
    toUSD: 0.27, // 1 PEN = ~0.27 USD
  },
  {
    name: 'Uruguay',
    currency: 'UYU',
    code: 'UY',
    phoneCode: '+598',
    flag: '🇺🇾',
    processingFee: 0,
    toUSD: 0.026, // 1 UYU = ~0.026 USD
  },
  {
    name: 'Venezuela',
    currency: 'VES',
    code: 'VE',
    phoneCode: '+58',
    flag: '🇻🇪',
    processingFee: 0,
    toUSD: 0.027, // 1 VES = ~0.027 USD
  },
];

async function seedCountries() {
  try {
    // Conectar ao MongoDB
    const mongoUri = `mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`;
    console.log('Conectando ao MongoDB:', mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB');

    // Definir o schema
    const CountrySchema = new mongoose.Schema({
      id: String,
      name: String,
      currency: String,
      picture: String,
      flag: String,
      processingFee: Number,
      toUSD: Number,
      phoneCode: String,
      code: String,
    }, { timestamps: true });

    const Country = mongoose.model('Country', CountrySchema);

    // Limpar países existentes (opcional)
    const existingCount = await Country.countDocuments();
    console.log(`📊 Países existentes: ${existingCount}`);

    if (existingCount === 0) {
      // Inserir países
      console.log('📝 Inserindo países...');
      await Country.insertMany(countries);
      console.log(`✅ ${countries.length} países inseridos com sucesso!`);
    } else {
      console.log('⚠️  Já existem países no banco. Pulando inserção.');
      console.log('💡 Para reinserir, delete os países primeiro ou modifique este script.');
    }

    // Listar países
    const allCountries = await Country.find();
    console.log('\n📋 Países no banco de dados:');
    allCountries.forEach(c => {
      console.log(`  - ${c.name} (${c.currency})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Concluído!');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seedCountries();
