/**
 * Script para iniciar o servidor com logs detalhados
 */

// Configurar variáveis de ambiente
process.env.NODE_ENV = 'development';
process.env.DATABASE_HOST = '185.215.165.19:3031';
process.env.DATABASE_NAME = 'mercadogamer';
process.env.MONGO_USER = 'admin';
process.env.MONGO_PASSWORD = 'MercadoGamer2024!';
process.env.BASE_URL = 'http://localhost:3000';
process.env.UPLOAD_DIR = './uploads';
process.env.IMAGES_DIR = './files';
process.env.DEBUG = 'api*';

console.log('🚀 Iniciando servidor com configuração de teste...\n');
console.log('📝 Variáveis de ambiente configuradas:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   DATABASE_HOST:', process.env.DATABASE_HOST);
console.log('   DATABASE_NAME:', process.env.DATABASE_NAME);
console.log('   MONGO_USER:', process.env.MONGO_USER ? '***' : 'not set');
console.log('');

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('\n❌ ERRO NÃO TRATADO (uncaughtException):');
  console.error('   Nome:', error.name);
  console.error('   Mensagem:', error.message);
  console.error('   Stack:', error.stack);
  console.error('');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ PROMISE REJEITADA NÃO TRATADA (unhandledRejection):');
  console.error('   Razão:', reason);
  console.error('   Promise:', promise);
  console.error('');
});

// Iniciar o servidor
console.log('🔧 Carregando aplicação...\n');

try {
  require('./index.js');
} catch (error) {
  console.error('\n❌ ERRO AO CARREGAR APLICAÇÃO:');
  console.error('   Nome:', error.name);
  console.error('   Mensagem:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
}
