/**
 * Pre-load environment variables BEFORE any ES6 imports
 * Este arquivo deve ser o primeiro a ser carregado
 */
require('dotenv').config();

console.log('✅ Environment variables loaded');
console.log('   DATABASE_HOST:', process.env.DATABASE_HOST || 'NOT SET');
console.log('   MONGO_USER:', process.env.MONGO_USER || 'NOT SET');
