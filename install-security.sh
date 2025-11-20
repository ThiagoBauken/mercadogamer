#!/bin/bash

# Script de Instalação de Segurança
# MercadoGamer - Backend Security Setup

echo "🔒 Instalando Pacotes de Segurança"
echo "==================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navegar para o diretório do backend
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api

echo "${YELLOW}📦 Instalando dependências de segurança...${NC}"
echo ""

# Instalar pacotes de segurança
npm install express-rate-limit helmet cors dotenv

echo ""
echo "${GREEN}✅ Dependências de segurança instaladas!${NC}"
echo ""

echo "${YELLOW}📋 Pacotes instalados:${NC}"
echo "  ✓ express-rate-limit - Rate limiting"
echo "  ✓ helmet - Headers de segurança"
echo "  ✓ cors - Controle de CORS"
echo "  ✓ dotenv - Variáveis de ambiente"
echo ""

echo "${YELLOW}📝 Próximos passos:${NC}"
echo ""
echo "1. Criar arquivo .env na raiz do projeto backend:"
echo "   cp .env.example .env"
echo ""
echo "2. Configurar variáveis de ambiente no .env:"
echo "   ALLOWED_ORIGINS=http://localhost:3001,http://localhost:4300"
echo "   IP_BLACKLIST="
echo "   JWT_SECRET=your_secret_here"
echo ""
echo "3. Atualizar app.js para usar os middlewares de segurança:"
echo "   const security = require('./middlewares/security');"
echo "   app.use(security.helmet);"
echo "   app.use(security.cors());"
echo "   app.use(security.rateLimiters.general);"
echo "   app.use(security.requestLogger);"
echo "   app.use(security.sanitizeInput);"
echo "   app.use(security.sqlInjectionDetection);"
echo ""
echo "4. Aplicar rate limiting específico em rotas de auth:"
echo "   router.post('/login', security.rateLimiters.auth, ...)"
echo ""
echo "${GREEN}🔐 Sistema de segurança pronto para ser configurado!${NC}"
echo ""
echo "⚠️  IMPORTANTE: Nunca commite o arquivo .env!"
echo "   Adicione .env ao .gitignore"
