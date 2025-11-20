#!/bin/bash

# Script de Instalação do Sistema i18n
# MercadoGamer - Internacionalização

echo "🌍 Instalando Sistema de Internacionalização (i18n)"
echo "=================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navegar para o diretório do frontend
cd MercadoGamer/apps/web

echo "${YELLOW}📦 Instalando dependências do i18n...${NC}"
npm install next-i18next react-i18next i18next

echo ""
echo "${GREEN}✅ Dependências instaladas com sucesso!${NC}"
echo ""

echo "${YELLOW}📋 Próximos passos:${NC}"
echo ""
echo "1. Atualizar next.config.js:"
echo "   const { i18n } = require('./next-i18next.config');"
echo "   module.exports = { i18n };"
echo ""
echo "2. Atualizar pages/_app.tsx:"
echo "   import { appWithTranslation } from 'next-i18next';"
echo "   export default appWithTranslation(MyApp);"
echo ""
echo "3. Adicionar traduções em cada página:"
echo "   export async function getStaticProps({ locale }) {"
echo "     return {"
echo "       props: {"
echo "         ...(await serverSideTranslations(locale, ['common'])),"
echo "       },"
echo "     };"
echo "   }"
echo ""
echo "4. Usar traduções nos componentes:"
echo "   const { t } = useTranslation('common');"
echo "   <h1>{t('welcome')}</h1>"
echo ""
echo "${GREEN}📚 Documentação completa:${NC} GUIA-I18N-IMPLEMENTACAO.md"
echo ""
echo "🚀 Sistema i18n pronto para ser configurado!"
