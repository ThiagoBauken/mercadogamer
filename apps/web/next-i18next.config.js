/**
 * next-i18next Configuration
 *
 * Configuração de internacionalização para o MercadoGamer
 * Suporta: Português (pt-BR), Inglês (en), Espanhol (es)
 */

const path = require('path');

module.exports = {
  i18n: {
    // Idiomas suportados
    locales: ['pt-BR', 'en', 'es'],

    // Idioma padrão
    defaultLocale: 'pt-BR',

    // Desabilitar detecção automática (Next.js 13.5+ requer false)
    localeDetection: false,
  },

  // Caminho local dos arquivos de tradução
  localePath: path.resolve('./public/locales'),

  // Configuração do react-i18next
  react: {
    useSuspense: false,
  },

  // Namespace padrão
  defaultNS: 'common',

  // Carregar múltiplos namespaces
  // IMPORTANTE: cada namespace usado em useTranslation('X') precisa estar aqui
  // E também precisa ser passado via serverSideTranslations na page wrapper
  ns: [
    'common',
    'auth',
    'products',
    'checkout',
    'dashboard',
    'profile',
    'errors',
    'validation',
    'home',
    'cart',
    'catalog',
    'kyc',
    'disputes',
  ],

  // Desenvolvimento
  debug: process.env.NODE_ENV === 'development',

  // Fallback para idioma padrão se tradução não existir
  fallbackLng: 'pt-BR',

  // Interpolação
  interpolation: {
    escapeValue: false, // React já escapa por padrão
  },

  // Recarregar em desenvolvimento
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
