# Integração de Métodos de Pagamento

Este documento descreve como configurar e usar os métodos de pagamento disponíveis no MercadoGamer.

## Métodos de Pagamento Disponíveis

1. **Mercado Pago** - Gateway de pagamento para América Latina
2. **Stripe** - Gateway de pagamento internacional (cartões de crédito)
3. **NowPayments** - Pagamentos em criptomoedas (BTC, ETH, USDT, etc.)

---

## 1. Mercado Pago

### Configuração

As credenciais do Mercado Pago já estão configuradas em `config/settings.js`. Para alternar entre ambiente de teste e produção, modifique:

```javascript
mp: {
  env: 'prod', // ou 'dev' para teste
  ...
}
```

### Endpoints

- `POST /api/mp/initPoint` - Criar link de pagamento
- `POST /api/mp/ipnv2` - Webhook para notificações de pagamento

---

## 2. Stripe

### Configuração

#### Passo 1: Obter Chaves da API

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Faça login ou crie uma conta
3. Navegue para **Developers > API keys**
4. Copie as chaves:
   - **Publishable key** (começa com `pk_`)
   - **Secret key** (começa com `sk_`)

#### Passo 2: Configurar Webhook Secret

1. No Dashboard do Stripe, vá para **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seu-dominio.com/api/stripe/webhook`
4. Selecione os eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Copie o **Signing secret** (começa com `whsec_`)

#### Passo 3: Adicionar as Chaves ao `.env`

Crie ou edite o arquivo `.env` na raiz do projeto API:

```bash
# Stripe - Test Environment
STRIPE_TEST_SECRET_KEY=sk_test_...
STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...

# Stripe - Live Environment (Produção)
STRIPE_LIVE_SECRET_KEY=sk_live_...
STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_...

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Passo 4: Alternar Ambiente

Em `config/settings.js`, modifique:

```javascript
stripe: {
  env: 'test', // ou 'live' para produção
  ...
}
```

### Endpoints

- `POST /api/stripe/create-payment-intent` - Criar intenção de pagamento
- `GET /api/stripe/payment-status/:paymentIntentId` - Consultar status
- `POST /api/stripe/webhook` - Webhook para notificações
- `GET /api/stripe/config` - Obter chave pública (publishable key)

### Exemplo de Uso

```javascript
// Frontend - Criar Payment Intent
const response = await fetch('/api/stripe/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50.00, // Valor em dólares
    currency: 'usd',
    externalReference: 'order-123',
    description: 'Compra de jogo',
    customerEmail: 'cliente@email.com'
  })
});

const { clientSecret } = await response.json();

// Use o clientSecret com Stripe Elements no frontend
```

---

## 3. NowPayments (Criptomoedas)

### Configuração

#### Passo 1: Criar Conta

1. Acesse [https://nowpayments.io](https://nowpayments.io)
2. Crie uma conta e faça login
3. Navegue para **Settings > API**

#### Passo 2: Obter API Key

1. Copie a **API Key** (ambiente sandbox ou production)
2. Opcionalmente, configure um **IPN Secret** para maior segurança

#### Passo 3: Adicionar as Chaves ao `.env`

```bash
# NowPayments - Sandbox
NOWPAYMENTS_SANDBOX_API_KEY=...

# NowPayments - Production
NOWPAYMENTS_API_KEY=...

# IPN Secret (opcional)
NOWPAYMENTS_IPN_SECRET=...
```

#### Passo 4: Configurar IPN (Instant Payment Notification)

1. No painel da NowPayments, vá para **Settings > IPN**
2. Configure a URL: `https://seu-dominio.com/api/nowpayments/ipn`
3. Ative as notificações

#### Passo 5: Alternar Ambiente

Em `config/settings.js`, modifique:

```javascript
nowpayments: {
  env: 'sandbox', // ou 'production'
  ...
}
```

### Endpoints

- `GET /api/nowpayments/currencies` - Listar criptomoedas disponíveis
- `GET /api/nowpayments/estimate` - Estimar valor em crypto
- `POST /api/nowpayments/create-payment` - Criar pagamento em crypto
- `GET /api/nowpayments/payment-status/:paymentId` - Consultar status
- `POST /api/nowpayments/ipn` - Webhook para notificações
- `GET /api/nowpayments/min-amount/:currency` - Valor mínimo para uma moeda

### Exemplo de Uso

```javascript
// 1. Obter criptomoedas disponíveis
const currencies = await fetch('/api/nowpayments/currencies');

// 2. Estimar preço
const estimate = await fetch(
  '/api/nowpayments/estimate?amount=50&currency_from=USD&currency_to=BTC'
);

// 3. Criar pagamento
const response = await fetch('/api/nowpayments/create-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceAmount: 50.00,
    priceCurrency: 'USD',
    payCurrency: 'BTC', // ou 'ETH', 'USDT', etc
    externalReference: 'order-123',
    description: 'Compra de jogo'
  })
});

const { payAddress, payAmount, payCurrency } = await response.json();

// Mostrar para o usuário:
// - Endereço: payAddress
// - Quantidade: payAmount
// - Moeda: payCurrency
```

---

## Fluxo de Pagamento

### 1. Usuário Seleciona Método de Pagamento

No frontend, apresente as opções:
- Mercado Pago (América Latina)
- Cartão de Crédito (Stripe)
- Criptomoeda (NowPayments)

### 2. Criar Pagamento

Dependendo da escolha, faça uma chamada para o endpoint correspondente:
- `/api/mp/initPoint`
- `/api/stripe/create-payment-intent`
- `/api/nowpayments/create-payment`

### 3. Processar Pagamento

- **Mercado Pago**: Redirecionar para o link retornado
- **Stripe**: Usar Stripe Elements com o clientSecret
- **NowPayments**: Mostrar endereço e valor em crypto

### 4. Confirmar Pagamento

Os webhooks processam automaticamente:
- `/api/mp/ipnv2`
- `/api/stripe/webhook`
- `/api/nowpayments/ipn`

Quando o pagamento é confirmado, o sistema cria automaticamente os pedidos.

---

## Modelo de Dados Atualizado

O modelo `paymentMethods` foi atualizado para suportar os novos métodos:

```javascript
{
  identifier: String, // cbu / cvu / email / crypto address
  type: String, // 'mercadoPago', 'bankTransfer', 'stripe', 'crypto'
  cryptoCurrency: String, // 'BTC', 'ETH', 'USDT', etc (para crypto)
  cryptoNetwork: String, // 'mainnet', 'testnet', etc (para crypto)
  stripeCustomerId: String, // Para Stripe
  stripePaymentMethodId: String, // Para Stripe
  user: ObjectId,
  enabled: Boolean
}
```

---

## Segurança

### Webhooks

Todos os webhooks implementam verificação de assinatura:

1. **Stripe**: Usa `stripe.webhooks.constructEvent()` com o webhook secret
2. **NowPayments**: Suporta verificação via IPN Secret
3. **Mercado Pago**: Verifica status diretamente da API

### Variáveis de Ambiente

**NUNCA** commite as chaves de API no git. Sempre use variáveis de ambiente (`.env`).

Adicione ao `.gitignore`:
```
.env
.env.local
.env.production
```

---

## Testando

### Mercado Pago
Use cartões de teste: [https://www.mercadopago.com.br/developers/pt/docs/shopify/additional-content/test-cards](https://www.mercadopago.com.br/developers/pt/docs/shopify/additional-content/test-cards)

### Stripe
Use cartões de teste: [https://stripe.com/docs/testing#cards](https://stripe.com/docs/testing#cards)
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`

### NowPayments
Use o ambiente sandbox com valores pequenos para teste.

---

## Suporte

Para problemas ou dúvidas:
- Mercado Pago: [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
- Stripe: [https://stripe.com/docs](https://stripe.com/docs)
- NowPayments: [https://nowpayments.io/help](https://nowpayments.io/help)
