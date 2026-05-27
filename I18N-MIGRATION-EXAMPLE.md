# 📝 Exemplo de Migração para i18n

Este documento mostra como migrar um componente existente do MercadoGamer para usar traduções.

## Exemplo 1: Componente de Login

### ❌ ANTES (hardcoded)

```typescript
// src/components/Login/Login.tsx
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <h1>Entrar</h1>
      <p>Acesse sua conta MercadoGamer</p>

      <TextField
        label="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <a href="/forgot-password">Esqueceu a senha?</a>

      <Button type="submit">
        Entrar
      </Button>

      <p>
        Não tem uma conta? <a href="/signup">Cadastre-se</a>
      </p>
    </form>
  );
}

export default Login;
```

### ✅ DEPOIS (com i18n)

```typescript
// src/components/Login/Login.tsx
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';

function Login() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <h1>{t('login.title')}</h1>
      <p>{t('login.subtitle')}</p>

      <TextField
        label={t('login.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label={t('login.password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <a href="/forgot-password">{t('login.forgot_password')}</a>

      <Button type="submit">
        {t('login.submit')}
      </Button>

      <p>
        {t('login.no_account')}{' '}
        <a href="/signup">{t('login.signup_link')}</a>
      </p>
    </form>
  );
}

export default Login;
```

**Arquivo de tradução usado:**
```json
// public/locales/pt-BR/auth.json
{
  "login": {
    "title": "Entrar",
    "subtitle": "Acesse sua conta MercadoGamer",
    "email": "E-mail",
    "password": "Senha",
    "forgot_password": "Esqueceu a senha?",
    "submit": "Entrar",
    "no_account": "Não tem uma conta?",
    "signup_link": "Cadastre-se"
  }
}
```

---

## Exemplo 2: Card de Produto

### ❌ ANTES

```typescript
// src/components/ProductCard/ProductCard.tsx
function ProductCard({ product }) {
  return (
    <Card>
      <CardMedia image={product.image} />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography color="text.secondary">
          R$ {product.price.toFixed(2)}
        </Typography>

        {product.discount > 0 && (
          <Chip label={`${product.discount}% OFF`} color="success" />
        )}

        {product.freeShipping && (
          <Chip label="Frete grátis" color="primary" />
        )}

        {product.stock === 0 ? (
          <Typography color="error">Esgotado</Typography>
        ) : (
          <Typography>{product.stock} em estoque</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button>Adicionar ao carrinho</Button>
        <Button>Ver detalhes</Button>
      </CardActions>
    </Card>
  );
}
```

### ✅ DEPOIS

```typescript
// src/components/ProductCard/ProductCard.tsx
import { useTranslation } from 'next-i18next';

function ProductCard({ product }) {
  const { t } = useTranslation(['common', 'products']);

  return (
    <Card>
      <CardMedia image={product.image} />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography color="text.secondary">
          {t('common:currency.symbol')} {product.price.toFixed(2)}
        </Typography>

        {product.discount > 0 && (
          <Chip
            label={t('products:card.discount', { percent: product.discount })}
            color="success"
          />
        )}

        {product.freeShipping && (
          <Chip label={t('products:card.free_shipping')} color="primary" />
        )}

        {product.stock === 0 ? (
          <Typography color="error">
            {t('products:card.out_of_stock')}
          </Typography>
        ) : (
          <Typography>
            {t('products:detail.stock', { count: product.stock })}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button>{t('products:card.add_to_cart')}</Button>
        <Button>{t('products:card.view_details')}</Button>
      </CardActions>
    </Card>
  );
}
```

---

## Exemplo 3: Validação de Formulário

### ❌ ANTES

```typescript
// src/utils/validation.ts
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'E-mail é obrigatório';
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'E-mail inválido';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Senha é obrigatória';
  }
  if (password.length < 6) {
    return 'Senha deve ter no mínimo 6 caracteres';
  }
  return null;
}
```

### ✅ DEPOIS

```typescript
// src/utils/validation.ts
import i18next from 'i18next';

export function validateEmail(email: string): string | null {
  if (!email) {
    return i18next.t('auth:validation.email_required');
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return i18next.t('auth:validation.email_invalid');
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return i18next.t('auth:validation.password_required');
  }
  if (password.length < 6) {
    return i18next.t('auth:validation.password_min');
  }
  return null;
}
```

**OU usando hook dentro de componente:**

```typescript
// src/components/RegisterForm.tsx
import { useTranslation } from 'next-i18next';

function RegisterForm() {
  const { t } = useTranslation('auth');

  const validateEmail = (email: string): string | null => {
    if (!email) return t('validation.email_required');
    if (!/\S+@\S+\.\S+/.test(email)) return t('validation.email_invalid');
    return null;
  };

  // ... resto do componente
}
```

---

## Exemplo 4: Mensagens de Toast/Notificação

### ❌ ANTES

```typescript
// src/actions/addToCart.ts
import { toast } from 'react-toastify';

export async function addToCart(product) {
  try {
    await api.post('/cart', { productId: product.id });
    toast.success('Produto adicionado ao carrinho!');
  } catch (error) {
    toast.error('Erro ao adicionar produto');
  }
}
```

### ✅ DEPOIS

```typescript
// src/actions/addToCart.ts
import { toast } from 'react-toastify';
import i18next from 'i18next';

export async function addToCart(product) {
  try {
    await api.post('/cart', { productId: product.id });
    toast.success(i18next.t('products:messages.added_to_cart'));
  } catch (error) {
    toast.error(i18next.t('common:messages.loading_error'));
  }
}
```

---

## Exemplo 5: Formatação de Data e Moeda

### ❌ ANTES

```typescript
// src/components/OrderItem.tsx
import moment from 'moment';

function OrderItem({ order }) {
  const formattedDate = moment(order.createdAt).format('DD/MM/YYYY');
  const formattedPrice = `R$ ${order.total.toFixed(2)}`;

  return (
    <div>
      <p>Data: {formattedDate}</p>
      <p>Total: {formattedPrice}</p>
    </div>
  );
}
```

### ✅ DEPOIS

```typescript
// src/components/OrderItem.tsx
import moment from 'moment';
import { useTranslation } from 'next-i18next';

function OrderItem({ order }) {
  const { t, i18n } = useTranslation('common');

  // Configurar locale do moment baseado no idioma atual
  moment.locale(i18n.language);

  const formattedDate = moment(order.createdAt).format('L'); // Formato local
  const currencySymbol = t('currency.symbol');
  const formattedPrice = `${currencySymbol} ${order.total.toFixed(2)}`;

  return (
    <div>
      <p>{t('time.date')}: {formattedDate}</p>
      <p>{t('total')}: {formattedPrice}</p>
    </div>
  );
}
```

---

## Exemplo 6: Estado de Pedido Dinâmico

### ❌ ANTES

```typescript
// src/components/OrderStatus.tsx
function OrderStatus({ status }) {
  const statusLabels = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  return <Chip label={statusLabels[status]} />;
}
```

### ✅ DEPOIS

```typescript
// src/components/OrderStatus.tsx
import { useTranslation } from 'next-i18next';

function OrderStatus({ status }) {
  const { t } = useTranslation('common');

  return <Chip label={t(`status.${status}`)} />;
}
```

**Arquivo de tradução:**
```json
// public/locales/pt-BR/common.json
{
  "status": {
    "pending": "Pendente",
    "processing": "Processando",
    "shipped": "Enviado",
    "delivered": "Entregue",
    "cancelled": "Cancelado"
  }
}
```

---

## Checklist de Migração

Para cada componente que você migrar:

- [ ] Importar `useTranslation` de `next-i18next`
- [ ] Identificar todos os textos hardcoded
- [ ] Criar/atualizar arquivo de tradução JSON correspondente
- [ ] Substituir textos por chamadas `t()`
- [ ] Adicionar `serverSideTranslations` na página que usa o componente
- [ ] Testar em todos os idiomas (pt-BR, en, es)
- [ ] Verificar se interpolações funcionam corretamente
- [ ] Testar pluralização se aplicável

---

## Scripts Úteis

### Encontrar textos hardcoded

```bash
# Buscar strings em português (textos entre aspas)
grep -r '"[A-ZÁÉÍÓÚÂÊÔÃÕÇ]' src/

# Buscar componentes sem useTranslation
grep -L "useTranslation" src/components/**/*.tsx
```

### Validar arquivos JSON

```bash
# Instalar JSON validator
npm install -g jsonlint

# Validar todos os arquivos
find public/locales -name "*.json" -exec jsonlint -q {} \;
```

---

## Dicas de Migração

1. **Migre por feature/módulo:** Não tente migrar tudo de uma vez
2. **Comece pelas páginas principais:** Home, Login, Catálogo
3. **Crie traduções incrementalmente:** Adicione ao JSON conforme for migrando
4. **Use namespaces:** Organize por feature (`auth`, `products`, etc.)
5. **Teste continuamente:** Mude o idioma frequentemente enquanto desenvolve
6. **Documente padrões:** Mantenha consistência nas chaves de tradução

---

Para mais informações, consulte o [Guia Completo de Implementação](GUIA-I18N-IMPLEMENTACAO.md).
