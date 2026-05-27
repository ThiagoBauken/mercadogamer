# 🌍 Guia de Implementação i18n - MercadoGamer

Este guia fornece instruções completas para implementar e usar o sistema de internacionalização (i18n) no MercadoGamer.

## 📋 Índice

1. [Instalação de Dependências](#instalação-de-dependências)
2. [Configuração do Next.js](#configuração-do-nextjs)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Usando Traduções em Componentes](#usando-traduções-em-componentes)
5. [Componente LanguageSwitcher](#componente-languageswitcher)
6. [Adicionando Novas Traduções](#adicionando-novas-traduções)
7. [Backend i18n](#backend-i18n)
8. [Boas Práticas](#boas-práticas)
9. [Troubleshooting](#troubleshooting)

---

## 1. 📦 Instalação de Dependências

### Frontend (Next.js)

```bash
cd MercadoGamer/apps/web
npm install next-i18next react-i18next i18next
```

**Versões recomendadas:**
- `next-i18next`: ^13.x (compatível com Next.js 13)
- `react-i18next`: ^12.x
- `i18next`: ^22.x

---

## 2. ⚙️ Configuração do Next.js

### 2.1 Atualizar `next.config.js`

```javascript
// MercadoGamer/apps/web/next.config.js
const { i18n } = require('./next-i18next.config');

module.exports = {
  // ... outras configurações existentes
  i18n,
  // ... resto da configuração
};
```

### 2.2 Configurar `_app.tsx`

```typescript
// MercadoGamer/apps/web/pages/_app.tsx
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
```

### 2.3 Configurar páginas

Cada página precisa carregar as traduções necessárias:

```typescript
// Exemplo: pages/index.tsx
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('nav.home')}</p>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'products'])),
    },
  };
}
```

**Para SSR (Server-Side Rendering):**

```typescript
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
}
```

---

## 3. 📁 Estrutura de Arquivos

```
MercadoGamer/apps/web/
├── next-i18next.config.js          # Configuração i18n
├── public/
│   └── locales/
│       ├── pt-BR/                  # Português do Brasil (padrão)
│       │   ├── common.json         # Textos comuns
│       │   ├── auth.json           # Autenticação
│       │   ├── products.json       # Produtos/Catálogo
│       │   ├── checkout.json       # Checkout
│       │   ├── dashboard.json      # Dashboard
│       │   ├── profile.json        # Perfil
│       │   ├── errors.json         # Mensagens de erro
│       │   └── validation.json     # Validações
│       ├── en/                     # Inglês
│       │   └── [mesmos arquivos]
│       └── es/                     # Espanhol
│           └── [mesmos arquivos]
└── src/
    └── components/
        └── LanguageSwitcher/       # Componente de troca de idioma
            ├── LanguageSwitcher.tsx
            └── index.ts
```

---

## 4. 🎨 Usando Traduções em Componentes

### 4.1 Hook `useTranslation`

```typescript
import { useTranslation } from 'next-i18next';

function ProductCard() {
  // Carregar namespace 'products'
  const { t } = useTranslation('products');

  return (
    <div>
      <h2>{t('card.title')}</h2>
      <button>{t('card.add_to_cart')}</button>
      <span>{t('card.free_shipping')}</span>
    </div>
  );
}
```

### 4.2 Múltiplos Namespaces

```typescript
function LoginPage() {
  const { t: tCommon } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');

  return (
    <form>
      <h1>{tAuth('login.title')}</h1>
      <button>{tCommon('save')}</button>
    </form>
  );
}
```

### 4.3 Interpolação de Variáveis

```typescript
function ProductList({ count }) {
  const { t } = useTranslation('products');

  return (
    <div>
      {/* Simples */}
      <p>{t('catalog.showing', { count })}</p>
      {/* Output: "Mostrando 42 produtos" */}

      {/* Com plural */}
      <p>{t('reviews.total', { count })}</p>
      {/* Output: "1 avaliação" ou "5 avaliações" */}
    </div>
  );
}
```

### 4.4 Tradução com HTML (Trans Component)

```typescript
import { Trans, useTranslation } from 'next-i18next';

function TermsCheckbox() {
  const { t } = useTranslation('auth');

  return (
    <label>
      <Trans
        i18nKey="auth:signup.terms_full"
        components={{
          termsLink: <a href="/terms" />,
          privacyLink: <a href="/privacy" />,
        }}
      />
      {/*
        JSON:
        "terms_full": "Eu aceito os <termsLink>Termos de Uso</termsLink> e a <privacyLink>Política de Privacidade</privacyLink>"
      */}
    </label>
  );
}
```

### 4.5 Tradução Dinâmica

```typescript
function OrderStatus({ status }) {
  const { t } = useTranslation('common');

  // status pode ser: 'active', 'pending', 'completed', etc.
  return <span>{t(`status.${status}`)}</span>;
}
```

### 4.6 Formatação de Datas e Moedas

```typescript
import { useTranslation } from 'next-i18next';
import moment from 'moment';

function ProductPrice({ price, date }) {
  const { t, i18n } = useTranslation('common');

  // Configurar locale do moment
  moment.locale(i18n.language);

  // Formatar moeda
  const currencySymbol = t('currency.symbol');
  const formattedPrice = `${currencySymbol} ${price.toFixed(2)}`;

  // Formatar data
  const formattedDate = moment(date).format('LL');

  return (
    <div>
      <p>{formattedPrice}</p>
      <p>{formattedDate}</p>
    </div>
  );
}
```

---

## 5. 🔄 Componente LanguageSwitcher

### 5.1 Importação Básica

```typescript
import LanguageSwitcher from '@/components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>
        {/* ... outros itens do menu ... */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### 5.2 Variantes

```typescript
// Apenas ícone (para mobile)
<LanguageSwitcher iconOnly />

// Botão outlined
<LanguageSwitcher variant="outlined" />

// Botão contained
<LanguageSwitcher variant="contained" />

// Tamanho pequeno
<LanguageSwitcher size="small" />

// Combinação
<LanguageSwitcher variant="outlined" size="small" iconOnly />
```

### 5.3 Posicionamento Recomendado

**Desktop Header:**
```typescript
<AppBar position="static">
  <Toolbar>
    <Logo />
    <Box sx={{ flexGrow: 1 }}>
      <Navigation />
    </Box>
    <SearchBar />
    <CartIcon />
    <UserMenu />
    <LanguageSwitcher variant="text" /> {/* Ao lado do UserMenu */}
  </Toolbar>
</AppBar>
```

**Mobile Menu:**
```typescript
<Drawer anchor="right" open={mobileMenuOpen}>
  <List>
    <ListItem>
      <LanguageSwitcher variant="outlined" size="small" />
    </ListItem>
    {/* ... outros itens ... */}
  </List>
</Drawer>
```

**Footer:**
```typescript
<Footer>
  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Copyright />
    <LanguageSwitcher iconOnly />
  </Box>
</Footer>
```

---

## 6. ➕ Adicionando Novas Traduções

### 6.1 Criar Novo Namespace

1. Criar arquivos em todas as línguas:

```bash
# Estrutura
public/locales/pt-BR/checkout.json
public/locales/en/checkout.json
public/locales/es/checkout.json
```

2. Adicionar ao `next-i18next.config.js`:

```javascript
module.exports = {
  // ...
  ns: [
    'common',
    'auth',
    'products',
    'checkout', // ← Novo namespace
  ],
  // ...
};
```

### 6.2 Estrutura de Tradução Recomendada

```json
{
  "section": {
    "subsection": {
      "key": "Valor traduzido",
      "key_plural": "Valores traduzidos"
    }
  },
  "messages": {
    "success": "Operação bem-sucedida",
    "error": "Ocorreu um erro"
  }
}
```

### 6.3 Exemplo Completo: Checkout

**pt-BR/checkout.json:**
```json
{
  "title": "Finalizar Compra",
  "steps": {
    "shipping": "Entrega",
    "payment": "Pagamento",
    "review": "Revisão"
  },
  "shipping": {
    "address": "Endereço de entrega",
    "method": "Método de entrega",
    "express": "Entrega expressa - {{days}} dias",
    "standard": "Entrega padrão - {{days}} dias"
  },
  "payment": {
    "method": "Método de pagamento",
    "credit_card": "Cartão de crédito",
    "pix": "PIX",
    "installments": "{{count}} parcela de {{value}}",
    "installments_plural": "{{count}} parcelas de {{value}}"
  },
  "summary": {
    "subtotal": "Subtotal",
    "shipping": "Frete",
    "discount": "Desconto",
    "total": "Total"
  },
  "actions": {
    "continue": "Continuar",
    "back": "Voltar",
    "place_order": "Finalizar Pedido"
  }
}
```

**Uso:**
```typescript
function CheckoutPage() {
  const { t } = useTranslation('checkout');

  return (
    <div>
      <h1>{t('title')}</h1>
      <Steps>
        <Step>{t('steps.shipping')}</Step>
        <Step>{t('steps.payment')}</Step>
        <Step>{t('steps.review')}</Step>
      </Steps>
      <button>{t('actions.place_order')}</button>
    </div>
  );
}
```

---

## 7. 🔧 Backend i18n

### 7.1 Instalação (Node.js/Express)

```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm install i18n
```

### 7.2 Configuração

```javascript
// api/config/i18n.js
const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['pt-BR', 'en', 'es'],
  defaultLocale: 'pt-BR',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
});

module.exports = i18n;
```

### 7.3 Middleware

```javascript
// api/app.js
const i18n = require('./config/i18n');

// Middleware para detectar idioma
app.use((req, res, next) => {
  // Pegar idioma do header Accept-Language ou query param
  const lang = req.query.lang || req.headers['accept-language'] || 'pt-BR';

  // Validar se é um idioma suportado
  const supportedLangs = ['pt-BR', 'en', 'es'];
  const locale = supportedLangs.includes(lang) ? lang : 'pt-BR';

  i18n.setLocale(req, locale);
  next();
});
```

### 7.4 Estrutura Backend

```
api/
├── config/
│   └── i18n.js
├── locales/
│   ├── pt-BR.json
│   ├── en.json
│   └── es.json
└── modules/
    └── users/
        └── route.js
```

### 7.5 Exemplo de Uso em Rotas

```javascript
// api/modules/users/route.js
router.post('/register', async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.json({
      success: true,
      message: req.__('user.registration_success'),
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: req.__('user.registration_error'),
      error: error.message
    });
  }
});
```

### 7.6 Emails Multilíngue

```javascript
// api/helpers/email/sendWelcomeEmail.js
const nodemailer = require('nodemailer');
const i18n = require('../../config/i18n');

async function sendWelcomeEmail(user, locale = 'pt-BR') {
  i18n.setLocale(locale);

  const subject = i18n.__('email.welcome.subject');
  const body = i18n.__('email.welcome.body', { name: user.name });

  await transporter.sendMail({
    to: user.email,
    subject,
    html: body,
  });
}
```

### 7.7 Arquivo de Tradução Backend

**locales/pt-BR.json:**
```json
{
  "user": {
    "registration_success": "Usuário cadastrado com sucesso!",
    "registration_error": "Erro ao cadastrar usuário",
    "not_found": "Usuário não encontrado",
    "invalid_credentials": "Credenciais inválidas"
  },
  "product": {
    "created": "Produto criado com sucesso",
    "updated": "Produto atualizado",
    "deleted": "Produto excluído",
    "out_of_stock": "Produto fora de estoque"
  },
  "order": {
    "placed": "Pedido realizado com sucesso",
    "cancelled": "Pedido cancelado",
    "shipped": "Pedido enviado",
    "delivered": "Pedido entregue"
  },
  "email": {
    "welcome": {
      "subject": "Bem-vindo ao MercadoGamer!",
      "body": "<h1>Olá {{name}}!</h1><p>Bem-vindo à nossa plataforma...</p>"
    },
    "order_confirmation": {
      "subject": "Pedido #{{orderId}} confirmado",
      "body": "<h1>Pedido Confirmado</h1><p>Seu pedido foi confirmado...</p>"
    }
  },
  "validation": {
    "email_required": "E-mail é obrigatório",
    "email_invalid": "E-mail inválido",
    "password_min": "Senha deve ter no mínimo {{min}} caracteres"
  }
}
```

---

## 8. ✅ Boas Práticas

### 8.1 Nomenclatura de Chaves

```json
// ✅ BOM - Hierárquico e descritivo
{
  "products": {
    "card": {
      "add_to_cart": "Adicionar ao carrinho",
      "out_of_stock": "Esgotado"
    }
  }
}

// ❌ EVITAR - Chaves planas e confusas
{
  "addToCart": "Adicionar ao carrinho",
  "oos": "Esgotado"
}
```

### 8.2 Plural com Contagem

```json
{
  "reviews": {
    "total": "{{count}} avaliação",
    "total_plural": "{{count}} avaliações"
  }
}
```

```typescript
// Uso
t('reviews.total', { count: 1 }); // "1 avaliação"
t('reviews.total', { count: 5 }); // "5 avaliações"
```

### 8.3 Valores Padrão (Fallback)

```typescript
// Se a chave não existir, mostrar valor padrão
t('new_feature.title', 'Novo Recurso');
```

### 8.4 Evitar Concatenação

```typescript
// ❌ EVITAR
<p>{t('user.welcome')} {user.name}!</p>

// ✅ MELHOR
<p>{t('user.welcome', { name: user.name })}</p>

// JSON:
// "welcome": "Bem-vindo, {{name}}!"
```

### 8.5 Organização por Feature

```
locales/
├── pt-BR/
│   ├── common.json           # Usado em todo o site
│   ├── auth.json             # Login/Register
│   ├── products.json         # Catálogo
│   ├── checkout.json         # Checkout
│   ├── dashboard.json        # Dashboard
│   └── profile.json          # Perfil
```

### 8.6 Comentários em JSON (não oficial mas útil)

```json
{
  "_comment": "Traduções para a página de checkout",
  "title": "Finalizar Compra",
  "steps": {
    "_comment": "Etapas do checkout",
    "shipping": "Entrega"
  }
}
```

---

## 9. 🐛 Troubleshooting

### Problema 1: Traduções não aparecem

**Sintoma:** `t('key')` retorna a chave em vez da tradução.

**Solução:**
1. Verificar se a página carrega o namespace correto:
```typescript
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])), // ← Incluir namespace
    },
  };
}
```

2. Verificar se o arquivo JSON existe em `public/locales/{locale}/{namespace}.json`

3. Verificar sintaxe JSON (sem vírgulas extras, aspas corretas)

### Problema 2: Idioma não muda

**Sintoma:** Clicar no LanguageSwitcher não muda o idioma.

**Solução:**
1. Verificar se `next.config.js` importa configuração i18n:
```javascript
const { i18n } = require('./next-i18next.config');
module.exports = { i18n };
```

2. Limpar cache do Next.js:
```bash
rm -rf .next
npm run dev
```

3. Verificar localStorage:
```javascript
localStorage.getItem('preferredLanguage')
```

### Problema 3: Interpolação não funciona

**Sintoma:** `{{variable}}` aparece literal no texto.

**Solução:**
```typescript
// ✅ CORRETO - Passar objeto como segundo parâmetro
t('message', { variable: 'valor' })

// ❌ ERRADO
t('message', 'valor')
```

### Problema 4: Plural não funciona

**Sintoma:** Sempre mostra singular, mesmo com count > 1.

**Solução:**
```json
// ✅ CORRETO - Sufixo _plural
{
  "items": "{{count}} item",
  "items_plural": "{{count}} itens"
}

// ❌ ERRADO
{
  "items": "{{count}} item(s)"
}
```

### Problema 5: Performance lenta

**Sintoma:** Mudança de idioma demora muito.

**Solução:**
1. Carregar apenas namespaces necessários por página
2. Usar `getStaticProps` em vez de `getServerSideProps` quando possível
3. Habilitar cache:
```javascript
// next-i18next.config.js
module.exports = {
  // ...
  serializeConfig: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
```

---

## 10. 📚 Recursos Adicionais

### Documentação Oficial
- [next-i18next](https://github.com/i18next/next-i18next)
- [react-i18next](https://react.i18next.com/)
- [i18next](https://www.i18next.com/)

### Ferramentas Úteis
- **i18n-ally** (VS Code Extension) - Visualizar traduções inline no código
- **Translation Manager** - Gerenciar traduções em equipe
- **DeepL API** - Tradução automática de alta qualidade

### Exemplo de Integração Completa

```typescript
// pages/products/[id].tsx
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ProductPage({ product }) {
  const { t } = useTranslation(['common', 'products']);

  return (
    <Layout>
      <Header>
        <LanguageSwitcher />
      </Header>

      <main>
        <h1>{product.name}</h1>
        <p>{t('products:detail.price')}: ${product.price}</p>
        <button>{t('products:card.add_to_cart')}</button>
      </main>

      <Footer>
        <p>{t('common:footer.copyright', { year: 2025 })}</p>
      </Footer>
    </Layout>
  );
}

export async function getStaticProps({ locale, params }) {
  const product = await fetchProduct(params.id);

  return {
    props: {
      product,
      ...(await serverSideTranslations(locale, ['common', 'products'])),
    },
  };
}
```

---

## 📝 Checklist de Implementação

- [ ] Instalar dependências (`next-i18next`, `react-i18next`, `i18next`)
- [ ] Criar `next-i18next.config.js`
- [ ] Atualizar `next.config.js` com configuração i18n
- [ ] Adicionar `appWithTranslation` em `_app.tsx`
- [ ] Criar arquivos de tradução em `public/locales/`
- [ ] Adicionar `serverSideTranslations` em todas as páginas
- [ ] Integrar `LanguageSwitcher` no Header
- [ ] Testar mudança de idioma em todas as páginas
- [ ] Implementar i18n no backend (opcional)
- [ ] Traduzir emails e notificações (opcional)
- [ ] Documentar processo para equipe

---

## 🎉 Conclusão

Com este guia, você tem tudo para implementar um sistema completo de internacionalização no MercadoGamer. O sistema suporta:

✅ **3 idiomas:** Português, Inglês, Espanhol
✅ **Troca dinâmica** de idioma sem reload
✅ **Persistência** de preferência do usuário
✅ **SEO-friendly** com URLs localizadas
✅ **Extensível** para adicionar novos idiomas
✅ **Backend i18n** para emails e API responses

Para dúvidas ou problemas, consulte a seção [Troubleshooting](#troubleshooting) ou a documentação oficial do next-i18next.

---

**Última atualização:** 19/11/2025
**Versão:** 1.0
