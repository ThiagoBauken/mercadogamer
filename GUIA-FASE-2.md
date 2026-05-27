# GUIA PARA FASE 2 - Continuar Traducao

## Como Traduzir um Componente

### Passo 1: Identificar textos hardcoded
```bash
# Exemplo: procurar textos em espanhol
grep -n "Agregar\|Comprar\|Total\|Precio" apps/web/src/page-contents/cart/index.tsx
```

### Passo 2: Adicionar useTranslation
```typescript
import { useTranslation } from 'next-i18next';

// Dentro do componente:
const { t } = useTranslation('namespace'); // namespace: common, auth, products, checkout
```

### Passo 3: Adicionar traducoes nos JSONs
Edite os 3 arquivos:
- `apps/web/public/locales/pt-BR/[namespace].json`
- `apps/web/public/locales/en/[namespace].json`
- `apps/web/public/locales/es/[namespace].json`

### Passo 4: Substituir textos
```typescript
// Antes:
<div>Agregar al carrito</div>

// Depois:
<div>{t('cart.add_to_cart')}</div>
```

## Componentes Prioritarios FASE 2

### 1. Checkout Page
```bash
# Localizar:
find apps/web/src/page-contents/checkout -name "*.tsx"

# Namespace: checkout (ja existe base)
# Textos principais: payment, shipping, summary, confirmation
```

### 2. Cart Page
```bash
# Localizar:
find apps/web/src/page-contents/cart -name "*.tsx"

# Namespace: common ou criar cart.json
# Textos principais: items, subtotal, shipping, total, remove, update
```

### 3. Product Detail Page
```bash
# Localizar:
find apps/web/src/page-contents/product-detail -name "*.tsx"

# Namespace: products
# Textos principais: description, reviews, questions, seller info
```

## Scripts Uteis

### Verificar compilacao
```bash
cd MercadoGamer/apps/web
npm run build
```

### Testar em dev
```bash
cd MercadoGamer/apps/web
npm run dev
```

### Validar JSONs
```bash
cd MercadoGamer/apps/web
node -e "console.log(JSON.parse(require('fs').readFileSync('public/locales/pt-BR/auth.json')))"
```

### Buscar textos hardcoded
```bash
# Buscar strings comuns em espanhol
grep -r "label:" apps/web/src/page-contents/ | grep -v node_modules
```

## Namespaces Recomendados

- **auth.json**: Login, Signup, Password Reset
- **common.json**: Navigation, Header, Footer, Buttons gerais
- **products.json**: Product Card, Product Detail, Filters, Categories
- **checkout.json**: Checkout flow, Payment, Shipping
- **dashboard.json**: (criar) Inventory, Orders, Sales, Profile

## Exemplo Completo

### Antes (cart/index.tsx):
```typescript
export const CartPage = () => {
  return (
    <div>
      <h1>Mi Carrito</h1>
      <button>Continuar Comprando</button>
      <button>Finalizar Compra</button>
    </div>
  );
};
```

### Depois (cart/index.tsx):
```typescript
import { useTranslation } from 'next-i18next';

export const CartPage = () => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('cart.title')}</h1>
      <button>{t('cart.continue_shopping')}</button>
      <button>{t('cart.checkout')}</button>
    </div>
  );
};
```

### common.json (adicionar):
```json
{
  "cart": {
    "title": "Meu Carrinho",
    "continue_shopping": "Continuar Comprando",
    "checkout": "Finalizar Compra"
  }
}
```

## Boas Praticas

1. Use namespaces apropriados (nao misture auth com products)
2. Use chaves descritivas (cart.title, nao cart.t1)
3. Mantenha consistencia entre idiomas
4. Teste cada componente apos traduzir
5. Crie backups antes de modificar

## Proximos 5 Componentes Sugeridos

1. apps/web/src/page-contents/cart/
2. apps/web/src/page-contents/checkout/
3. apps/web/src/page-contents/product-detail/
4. apps/web/src/page-contents/dashboard/inventory/
5. apps/web/src/page-contents/dashboard/order/
