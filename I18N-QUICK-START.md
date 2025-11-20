# 🚀 Quick Start - Internacionalização MercadoGamer

## Instalação Rápida (5 minutos)

### 1. Instalar Dependências

```bash
cd MercadoGamer/apps/web
npm install next-i18next react-i18next i18next
```

### 2. Atualizar `next.config.js`

```javascript
// MercadoGamer/apps/web/next.config.js
const { i18n } = require('./next-i18next.config');

module.exports = {
  // ... configurações existentes ...
  i18n,
};
```

### 3. Atualizar `_app.tsx`

```typescript
// MercadoGamer/apps/web/pages/_app.tsx
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
```

### 4. Adicionar em cada página

```typescript
// Exemplo: pages/index.tsx
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');

  return <h1>{t('welcome')}</h1>;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
```

### 5. Adicionar LanguageSwitcher no Header

```typescript
// MercadoGamer/apps/web/src/components/Header.tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>
        {/* ... seus componentes ... */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

## 🎯 Uso Básico

```typescript
// Texto simples
{t('common:welcome')}

// Com variáveis
{t('products:catalog.showing', { count: 42 })}

// Múltiplos namespaces
const { t: tCommon } = useTranslation('common');
const { t: tAuth } = useTranslation('auth');
```

## 📁 Arquivos Criados

```
✅ next-i18next.config.js           # Configuração
✅ public/locales/pt-BR/*.json       # Traduções PT
✅ public/locales/en/*.json          # Traduções EN
✅ public/locales/es/*.json          # Traduções ES
✅ src/components/LanguageSwitcher/  # Componente de troca
```

## 📚 Próximos Passos

1. **Leia o guia completo:** [GUIA-I18N-IMPLEMENTACAO.md](GUIA-I18N-IMPLEMENTACAO.md)
2. **Adicione traduções** para suas páginas
3. **Customize** o LanguageSwitcher conforme seu design
4. **Implemente i18n no backend** (opcional)

## 🐛 Problemas?

- **Traduções não aparecem?** Verifique se adicionou `serverSideTranslations` na página
- **Idioma não muda?** Limpe o cache: `rm -rf .next && npm run dev`
- **Erro de build?** Verifique sintaxe JSON dos arquivos de tradução

---

Para documentação completa, veja [GUIA-I18N-IMPLEMENTACAO.md](GUIA-I18N-IMPLEMENTACAO.md)
