# 📊 MercadoGamer — Estado Real

**Última atualização**: 27/05/2026
**Verificado por**: testes manuais via curl + smoke test integrado

---

## 🟢 Stack atual

### Backend (`MercadoGamer-Backend-main/MercadoGamer-Backend-main/api`)

| Componente | Versão | Status |
|---|---|---|
| Node.js | 22.20.0 | ✅ |
| Express | 4.21 | ✅ |
| Mongoose | 8.24 | ✅ |
| Socket.IO server | 4.8 | ✅ |
| Socket.IO client (server-side ping) | 4.8 | ✅ |
| bcryptjs | 3.0 | ✅ |
| Stripe SDK | 18.0 | ✅ (precisa de key real) |
| MercadoPago SDK | 2.0 | ✅ (precisa de access token real) |
| multer | 1.4 LTS | ✅ |
| axios | 1.7 | ✅ |
| @googlemaps/google-maps-services-js | 3.4 | ✅ (não usado no código atual) |
| Babel | — | ❌ removido (Node 22 roda CommonJS nativo) |

### Frontend (`MercadoGamer/`)

| Componente | Versão | Status |
|---|---|---|
| Next.js | 14.2.35 | ✅ |
| React | 18.2 | ✅ |
| Nx | 19.8 | ✅ |
| socket.io-client | 4.8 | ✅ |
| MUI | 5.11 | ✅ |
| next-i18next | 15.4 | ✅ plugada — 5 namespaces fix (28/05/2026) |
| styled-components | 6.1 | ✅ (via SWC do Next 14) |
| Apps | `apps/web` (port 4200), `apps/admin` (port 4300) | ✅ **ambos testados no browser** |

### Admin panel (`apps/admin`) — funcional 28/05/2026

| Item | Status |
|---|---|
| Login backend `POST /api/administrators/login` | ✅ retorna JWT |
| `/login` renderiza form (E-mail + Contraseña) | ✅ |
| `/ventas` (tabela de vendas, 15 colunas) | ✅ |
| `/users` (tabela de usuários: USUARIO/E-MAIL/COMPRAS/VENTAS) | ✅ |
| Nav links: Ruleta / Ganancias / Ventas / Usuarios / Cargas | ✅ |
| Botões: Cerrar sesión / Descargar tabla / Cargar mas | ✅ |

**Credencial padrão**: `admin` / `MercadoGamer2024!` (criada via `npm run init-db`).

**Fixes aplicados pra admin funcionar (28/05/2026)**:
- `apps/admin/tsconfig.json` — TypeScript paths estavam vazios. Adicionados `@admin/*, @store, @utils, @widgets/*, @theme/*, @icons, @ui-shared/*, @action-types, @hooks` (16 paths).
- `apps/admin/src/components/navButton/navButton.tsx` — `<Link><a>texto</a></Link>` (sintaxe Next 12) trocado por `<Link className=...>texto</Link>` (sintaxe Next 14). Causava `Error: Invalid <Link> with <a> child`.

### Docker (deploy unificado local)

| Item | Status |
|---|---|
| `docker-compose.yml` raiz | ✅ válido, 5 serviços (mongo, backend, web, admin, mailhog) |
| Dockerfile dev (backend) | ✅ Node 22 |
| Dockerfile.production (backend) | ✅ Node 22 multi-stage |
| Dockerfile.web (frontend) | ✅ Node 22 |
| Dockerfile.web.production (frontend) | ✅ Node 22 multi-stage |
| Dockerfile.admin (frontend) | ✅ Node 22 |
| Dockerfile.admin.production (frontend) | ✅ Node 22 multi-stage |
| `.env` template no `docker-compose.yml` | ✅ KYC, escrow, Stripe, MP, Twilio, JWT, CORS |

**Como rodar localmente com Docker** (após instalar Docker Desktop):

```bash
cd C:\Users\Thiago\Desktop\marketplace
docker compose up -d --build         # build + sobe TUDO em uma máquina
docker compose exec backend npm run init-db   # popular Brasil + admin
```

URLs:
- Site: http://localhost:3001
- Admin: http://localhost:4300
- API: http://localhost:3000
- Mailhog (capturar emails): http://localhost:8025

**Validei na sessão**: YAML válido (`python -c "import yaml; yaml.safe_load(...)"`), todos os Dockerfiles estão no Node 22, env vars completas. Não rodei `docker compose up` localmente porque Docker Desktop não está instalado nessa máquina — quando você instalar, deve subir direto.

---

## ✅ Endpoints validados (curl, 27/05/2026)

### Públicos (sem autenticação)

| Endpoint | Método | Status |
|---|---|---|
| `/api/health` | GET | ✅ 200 — `{mongodb: connected}` |
| `/api/users` (POST cadastro) | POST | ✅ 201 — após `init-db` popular Brasil |
| `/api/users/login` | POST | ✅ 200 — body `{username, password}` |
| `/api/users/checkName/:username` | GET | ✅ 200 |
| `/api/users/checkEmail/:email` | GET | ✅ 200 |
| `/api/users/profile/:id` | GET | ✅ 200 |
| `/api/products` | GET | ✅ 200 |
| `/api/games` | GET | ✅ 200 |
| `/api/categories` | GET | ✅ 200 |
| `/api/platforms` | GET | ✅ 200 |
| `/api/countries` | GET | ✅ 200 — Brasil presente |
| `/api/banners` | GET | ✅ 200 |
| `/api/homeProducts` | GET | ✅ 200 |
| `/api/reviews` | GET | ✅ 200 |
| `/api/paymentMethods` | GET | ✅ 200 |

### Autenticados (header `x-access-token: <jwt>`)

| Endpoint | Método | Status |
|---|---|---|
| `/api/users` (lista) | GET | ✅ 200 |
| `/api/users/sendSms` | GET | ✅ 200 (mock — não envia SMS real) |
| `/api/orders` | GET | ✅ 200 |
| `/api/carts` | GET | ✅ 200 |
| `/api/conversations` | GET | ✅ 200 |
| `/api/notifications` | GET | ✅ 200 |
| `/api/products/createNewProduct` | POST | ⚠️ não testado fim-a-fim (precisa de game/platform/etc) |
| `/api/files/upload` | POST (multipart) | ✅ 200 — multer + sharp salvam .webp em `./files/` |
| `/api/mp/initPoint` | POST | ✅ SDK funciona (400 esperado por access token expirado) |

### WebSocket

| Item | Status |
|---|---|
| Handshake Socket.IO v4 (`/socket.io/?EIO=4`) | ✅ 200 |
| Conexão real (cliente v4 → server) | ✅ funciona |
| Emit + echo (`test-socket` event) | ✅ ida e volta funciona |

---

## 🟡 Pontos de atenção

### 1. Credenciais externas necessárias (vazias hoje no `.env`)
- `MP_ACCESS_TOKEN` (MercadoPago) — sem isso, checkout retorna 400 "UNAUTHORIZED"
- `STRIPE_TEST_SECRET_KEY` ou `STRIPE_LIVE_SECRET_KEY` — sem isso, Stripe falha
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` — SMS está mockado
- Google Maps — não usado no código atual, mas se ativar precisa de key

### 2. Convenções não-óbvias (afetam o frontend)
- **Auth header**: o backend espera `x-access-token: <jwt>`, NÃO `Authorization: Bearer X`
- **Login payload**: `{username, password}` — NÃO `{emailOrUsername, password}`
- **POST produto**: `/api/products/createNewProduct`, NÃO `/api/products`
- **POST upload**: campo `file` no multipart

### 3. Diretórios obrigatórios em runtime
- `api/files/` (uploads finais) e `api/uploads/` (temp do multer) precisam existir antes de subir
- Foram criados com `.gitkeep` no commit de Fase 3

### 4. Banco precisa do `init-db` pra primeiro uso
- País Brasil precisa existir na collection `countries` antes que qualquer cadastro funcione
- Rodar: `npm run init-db` (uma vez)

### 5. Frontend i18n não plugado
- Arquivos JSON existem em `MercadoGamer/apps/web/public/locales/{pt-BR,en,es}/`
- `next-i18next.config.js` configurado
- Falta integrar `appWithTranslation` no `apps/web/pages/_app.tsx`

---

## 🟢 Escrow + Disputas — IMPLEMENTADO (28/05/2026)

### Escrow real (P0.2)

**Schema `orders`** (campos novos):
- `heldAt`, `releaseScheduledAt`, `releasedAt`, `holdDays`, `escrowAmount`, `releaseBlocked`
- Enum `status` expandido: `held` (em escrow), `released` (liberado), além dos legados

**Fluxo**:
1. Pagamento confirma → order.status = `held`, releaseScheduledAt = now + holdDays (default 3 dias)
2. Cron `escrow.releaseEscrow` roda a cada hora (configurável via `ESCROW_CRON_PERIOD`)
3. Cron busca orders com `releaseScheduledAt <= now` e `releaseBlocked != true`
4. Para cada: status → `released`, releasedAt = now, seller.balance += escrowAmount
5. Notifications criadas (`purchaseReleased`, `sellerPaymentReleased`)

**Configurável** via env:
- `ESCROW_HOLD_DAYS` (default 3)
- `ESCROW_CRON_PERIOD` (default 1x/hora)
- `ESCROW_DRY_RUN=true` (modo simulação)
- `ESCROW_CRON_DISABLED=true` (desligar)

**Removido**: hook `post('find')` antigo que fazia release lazy/inseguro — substituído por cron determinístico.

**Smoke test 28/05/2026** (script standalone Node):
- ✅ Order com `releaseScheduledAt` no passado: cron libera
- ✅ Seller balance 0 → 42.50 após release
- ✅ Order com `releaseBlocked: true`: cron ignora

### Disputas (P0.3)

**Novo módulo `modules/disputes/`** com schema completo:
- order, buyer, seller, reason (enum: not_received, not_working, fake, chargeback, other)
- status (open → awaiting_seller → awaiting_buyer → admin_review → resolved_*)
- messages array (histórico buyer/seller/admin)
- evidence array (paths de arquivos uploaded)
- resolution {decision, decidedBy, reason, refundAmount, decidedAt}
- sellerResponseDeadline (48h SLA)

**Endpoints `/api/disputes`** (8 totais):
| Endpoint | Quem | Comportamento |
|---|---|---|
| `POST /api/disputes` | buyer | Abre disputa → order.releaseBlocked=true, status=complaint |
| `GET /api/disputes/mine` | user | Lista disputas onde é buyer OU seller |
| `GET /api/disputes/:id` | participantes/admin | Detalhe |
| `POST /api/disputes/:id/respond` | seller | Responde, status→awaiting_buyer |
| `POST /api/disputes/:id/escalate` | buyer | Status→admin_review |
| `POST /api/disputes/:id/message` | qualquer participante/admin | Adiciona mensagem |
| `POST /api/disputes/:id/cancel` | buyer | Cancela própria disputa, desbloqueia order |
| `POST /api/disputes/:id/resolve` | admin only | Decide refund_buyer (cancel order + refund) ou release_seller (libera escrow) |
| `GET /api/disputes/admin/pending` | admin only | Lista disputas em admin_review |

**Smoke test 28/05/2026** (E2E fluxo completo):
- ✅ Buyer abre disputa → order.status=complaint, releaseBlocked=true
- ✅ Duplicata rejeitada (1 disputa aberta por order)
- ✅ Seller responde → status=awaiting_buyer, messages.length=2
- ✅ Buyer escala → status=admin_review
- ✅ Buyer cancela mesmo após escalate → status=cancelled, order desbloqueada (volta pra held)

---

## 🟢 Seguro do vendedor (P1.7) — IMPLEMENTADO (28/05/2026)

Fundo de reembolso automático. 2% de cada venda liberada vai pro fundo. Admin pode usar pra reembolsar buyer em disputas quando o vendedor já sacou.

**Novo módulo `modules/platformFunds/`**:
- `model.js`: collection insert-only (livro-razão), eventos `credit` / `debit` com referência a `order`/`dispute`/`user`/`authorAdmin`. Saldo = `SUM(credits) - SUM(debits)`.
- `route.js`: 4 endpoints:
  - `GET /balance` (**público** — transparência) — retorna saldo atual + explicação
  - `GET /transactions` (admin) — paginado com filtro por type
  - `POST /refund` (admin) — usa fundo pra reembolsar buyer numa disputa
  - `POST /manual-adjustment` (admin) — ajustes raros com notes obrigatório

**Cron escrow atualizado** (`crons/escrow/release_escrow.js`):
- Antes do release: calcula `fundFee = amount * 0.02` (configurável via `PLATFORM_FUND_FEE_RATE`)
- Seller recebe `amount - fundFee` (98%)
- Fundo recebe `fundFee` (2%) — registro automático com `reason: 'escrow_release_fee'`
- Não-bloqueante: se falhar gravação do fundo, release ainda completa

**Diferencial competitivo**: 
- GGMax e Desapego não mostram fundo de garantia publicamente.
- Aqui `GET /api/platformFunds/balance` é público — comprador vê quanto a plataforma tem em reserva.
- Mensagem de marketing: "R$ XXX em fundo de garantia para reembolsos".

**Smoke test 28/05/2026**: `GET /balance` retorna `{balance: 0, totalCredits: 0, totalDebits: 0}` (fundo vazio, esperado).

---

## 🟢 Frontend `/dashboard/upgrade` — IMPLEMENTADO (28/05/2026)

Tela com 3 cards comparativos (Free / Pro / Premium):
- Cards com nome, preço, descrição, features list, botão Assinar
- Card "Pro" destacado como ⭐ Mais escolhido
- Card do plano atual mostra ✅ Plano atual
- Botão Cancelar assinatura (se ativa)
- Banner se `stripeSubscriptionStatus === 'past_due'`
- Toast em sucesso/cancel do Stripe Checkout redirect
- Item no menu lateral "Planos pagos" / "Plans" / "Planes"
- 3 idiomas (upgrade.json)

Quando clica "Assinar": chama `POST /api/subscriptions/create-checkout` → recebe URL Stripe → redireciona.

---

## 🟢 Planos pagos (P1.6) — IMPLEMENTADO backend (28/05/2026)

Sistema Stripe Subscriptions completo. **Free / Pro R$29.90/mês / Premium R$99.90/mês.**

**Catálogo em `helpers/billing/plans.js`** (3 planos):
| Plano | Comissão | Anúncios | Destaques | Selo | Analytics | Suporte |
|---|---|---|---|---|---|---|
| Free | 10% | 10 | 0 | — | ❌ | email |
| Pro (R$ 29.90) | 7% | 100 | 3 | 🔵 Pro | ✅ | email |
| Premium (R$ 99.90) | 5% | ∞ | 10 | 🏆 Premium | ✅ | prioritário 4h |

**Schema `users` novos campos**:
- `sellerPlan`: 'free' / 'pro' / 'premium'
- `sellerPlanActiveUntil`: Date — null = sem assinatura
- `stripeCustomerId`, `stripeSubscriptionId` (select: false)
- `stripeSubscriptionStatus`

**Schema novo `subscriptions`** (audit log):
- Events: checkout_created, subscription_activated, payment_succeeded/failed, subscription_canceled
- Snapshot raw do webhook (select: false)

**Endpoints `/api/subscriptions/*`**:
| Endpoint | Quem | Comportamento |
|---|---|---|
| `GET /plans` | público | Lista 3 planos com features |
| `GET /current` | user | Plano atual + isActive + activeUntil |
| `POST /create-checkout` | user | Body `{planId: 'pro'\|'premium'}` → cria Stripe Checkout Session, retorna `url` |
| `POST /cancel` | user | Marca subscription pra cancelar no fim do período |
| `POST /webhook` | Stripe | Processa checkout_completed, payment_succeeded/failed, subscription_updated/deleted |

**Helper functions exposed**:
- `plans.calculateCommission(seller, saleAmount)` — usar nos pagamentos de orders
- `plans.canAddListing(seller, currentCount)` — usar antes de criar produto

**Pré-requisitos pra ativar em produção**:
1. Dashboard Stripe → Products → criar "MercadoGamer Pro" + "MercadoGamer Premium" (recurring monthly BRL)
2. Copiar `price_xxx` pros env `STRIPE_PRICE_PRO` e `STRIPE_PRICE_PREMIUM`
3. Webhooks → adicionar endpoint `https://api.mg.com.br/api/subscriptions/webhook`
4. Selecionar eventos: `checkout.session.completed`, `invoice.payment_*`, `customer.subscription.*`
5. Copiar signing secret → `STRIPE_WEBHOOK_SECRET`

**Smoke test 28/05/2026** (curl):
- ✅ `GET /plans` retorna 3 planos com preços e features
- ✅ `GET /current` retorna `{planId:"free", isActive:true}` pra novo user
- ✅ `POST /create-checkout` sem STRIPE_PRICE_PRO retorna erro descritivo

**Frontend tela `/dashboard/upgrade`**: pendente. Tela com 3 cards comparativos + botão "Assinar" que chama create-checkout e redireciona pra Stripe.

---

## 🟢 KYC nível 2 — IMPLEMENTADO backend + frontend (28/05/2026)

Backend já documentado abaixo. **Frontend** agora também:
- Página `/dashboard/kyc-nivel-2` com 3 uploads (doc frente, verso, selfie)
- Preview instantâneo via `URL.createObjectURL`
- Capture mobile (`capture="environment"` doc, `"user"` selfie)
- Gate: requer kycLevel >= 1, mostra link pra /dashboard/kyc caso contrário
- Status display: pending/manual_review/approved/rejected com banner colorido
- Item no menu lateral "Verificação avançada"
- 3 idiomas traduzidos

---

## 🟢 SEO básico — IMPLEMENTADO (28/05/2026)

**`next-sitemap.config.js` dinâmico**:
- Lê `process.env.NEXT_PUBLIC_DOMAIN` (não mais hardcoded)
- `additionalPaths` busca via API: produtos (`/product-detail/:id`), vendedores únicos (`/vendedores/:username`), games (`/catalogo?game=:id`)
- Cada fetch com `.catch(()=>null)` — build nunca falha por API instável
- Transform com changefreq/priority diferenciados (home 1.0, catalogo 0.9, produto 0.8, vendedor 0.6)

**JSON-LD Product Schema.org** em product-detail:
- `@type: Product` com name, description, image, offers (price/currency/availability), seller, aggregateRating (se reviews > 0)

**Open Graph + Twitter tags** em `_app.tsx`:
- og:title, og:description, og:image, og:type, og:url
- twitter:card summary_large_image
- Hardcoded `https://www.mercadogamer.com` → `process.env.NEXT_PUBLIC_DOMAIN || 'https://mercadogamer.com.br'`

---

## 🟢 KYC nível 2 — IMPLEMENTADO backend (28/05/2026)

Foto documento + selfie + biometria facial. Promove `kycLevel` de 1 → 2 quando aprovado.

**Schema users novos campos** (todos com `select: false`):
- `documentPhotoUrl`, `documentPhotoBackUrl`, `selfiePhotoUrl`
- `faceMatchScore` (0-100, AWS Rekognition)
- `kycLevel2SubmittedAt`, `kycLevel2ReviewedAt`
- `kycLevel2Status`: `none | pending | approved | rejected | manual_review`
- `kycLevel2RejectionReason`

**Helper `helpers/kyc/rekognition.js`**:
- Modo MOCK (default) — sempre aprova com score 90
- Modo AWS Rekognition real — via env `AWS_ACCESS_KEY_ID/SECRET/REGION`
- Lazy require do `@aws-sdk/client-rekognition` (não falha se não instalado)

**Endpoints `/api/kyc/*` (nível 2)**:
| Endpoint | Quem | Comportamento |
|---|---|---|
| `POST /submit-document-photos` | user com KYC nível 1 | Body `{documentPhotoUrl, documentPhotoBackUrl?, selfiePhotoUrl}`. Roda Rekognition. ≥85% similarity → approved. <85% → manual_review |
| `GET /level2-status` | user | Estado atual + score + rejection reason |
| `GET /admin/level2-pending` | admin | Lista users em manual_review |
| `POST /admin/level2-decide` | admin | Body `{userId, decision: approve\|reject, reason?}` |

**Smoke test 28/05/2026** (curl):
- ✅ `GET /level2-status` → `{status: "none"}`
- ✅ `POST /submit-document-photos` sem KYC nível 1 → HTTP 400 bloqueado
- ✅ `GET /admin/level2-pending` sem admin → HTTP 401 "Acceso inválido"

**Frontend nível 2**: NÃO implementado ainda. Falta tela `pages/dashboard/kyc-nivel-2.tsx` com upload de 3 fotos (documento frente, verso, selfie) → POST submit.

---

## 🟢 Reviews ponderados — IMPLEMENTADO (28/05/2026, P1.8)

Schema `reviews` agora calcula peso automaticamente baseado no qualifier:

```
weight = 0.3                    se kycLevel = 0 (anti-fraude)
       = 1.0                    se kycLevel >= 1
       = 1.5                    se kycLevel >= 2
       + 0.5                    se purchaseCount >= 5 (bonus experiência)
       max 2.0 (cap)
```

**Snapshots** salvos no review: `weight`, `kycLevelAtTime`, `purchaseCountAtTime`.

**Hooks Mongoose**:
- `pre-save`: calcula weight ao criar review
- `post-save`: recalcula `sellerQualification` / `userQualification` no user qualified, usando **média ponderada** `sum(rating * weight) / sum(weight)`

Resultado: GGMax dá 4.8 média porque vendedores fazem self-reviews fake. Aqui, reviews de contas não-verificadas pesam 70% menos.

---

## 🟢 KYC nível 1 — IMPLEMENTADO (27/05/2026)

Backend completo. Falta tela no frontend.

**Schema `users`** (campos novos):
- `cpf` (unique, sparse), `birthDate`, `fullName`
- `kycLevel` (0-3, default 0)
- `verifiedEmail`, `verifiedPhone`, `verifiedCPF` (booleans)
- Tokens/códigos com `select:false` (não vazam em JSON)

**Endpoints `/api/kyc/*`**:
| Endpoint | Comportamento |
|---|---|
| `GET /api/kyc/status` | Retorna `{kycLevel, checklist:{email,phone,cpf}, canSell, canWithdraw}` |
| `POST /api/kyc/send-email-verification` | Gera token 32B, expira 24h. Em dev, devolve `devVerificationLink` |
| `POST /api/kyc/verify-email` | Body `{verificationToken}` (NÃO `token` — conflita com auth) |
| `POST /api/kyc/send-phone-verification` | Gera código 6-digit, expira 10min. Em dev, devolve `devCode`. Real via Twilio se configurado |
| `POST /api/kyc/verify-phone` | Body `{code}`. Máx 5 tentativas |
| `POST /api/kyc/submit-cpf` | Body `{cpf, fullName, birthDate}`. Mock checa só checksum. Se `SERPRO_API_TOKEN` setado, consulta Receita Federal |

**Promoção automática**: quando email + phone + CPF estão todos verificados → `kycLevel` vira 1.

**Middleware `requireKyc(N)`** em `helpers/security/requireKyc.js`:
- Aplicado em `POST /api/products/createNewProduct` (admins bypass)
- Aplicado em `POST /api/withdrawals/create`
- Bloqueia com HTTP 403 + mensagem clara se kycLevel insuficiente

**Audit log** em collection `kyc`:
- Cada tentativa (email/phone/cpf) gera registro com user, type, status, IP, user-agent
- Útil pra LGPD, anti-fraude, debug

**Validação Serpro** em `helpers/kyc/serpro.js`:
- Modo MOCK (default) — só checksum local
- Modo REAL — chamada autenticada na API Serpro CPF. Custo ~R$0,05/consulta
- Switch automático via `SERPRO_API_TOKEN` env

**Smoke test 27/05/2026** (curl):
- ✅ Cadastro → status retorna `kycLevel:0, checklist:{false,false,false}`
- ✅ Email: send → verify → `verifiedEmail:true`
- ✅ SMS: send → verify → `verifiedPhone:true`
- ✅ CPF checksum inválido → HTTP 400 rejeitado
- ✅ CPF válido (`111.444.777-35`) → `verifiedCPF:true, kycLevel:1`
- ✅ `/api/products/createNewProduct` sem KYC → HTTP 403 "Verificação KYC nível 1 requerida"
- ✅ `/api/withdrawals/create` sem KYC → HTTP 403
- ✅ Com KYC nível 1 → middleware deixa passar (handler responde por outro motivo)

---

## 🔴 O que NÃO está implementado (zero código)

| Feature | Documentado em | Status |
|---|---|---|
| **KYC nível 2** (foto + selfie + biometria) | `GUIA-IMPLEMENTACAO-KYC.md` | ❌ 0% (nível 1 ✅) |
| **Escrow** (estados `held`/`released`) | `MELHORIAS-SUGERIDAS.md` | ❌ 0% |
| **Sistema de disputas** | — | ❌ módulo `issues` existe mas é genérico |
| **Selos verificados** (lógica server-side) | `ANALISE-COMPETITIVA-CONCORRENTES.md` | ❌ badges existem só no React |
| **Planos vendedor** (Silver/Gold/Diamond) | `MELHORIAS-SUGERIDAS.md` | ❌ schema sem campo |
| **MG Points** (gamificação) | — | ❌ só roulette |
| **Discord bot** | `MELHORIAS-ADICIONAIS-IA-DISCORD.md` (1.468 linhas) | ❌ 0% |
| **Chatbot IA (GPT)** | `MELHORIAS-ADICIONAIS-IA-DISCORD.md` | ❌ 0% |
| **Verificador público** de conta | `ANALISE-COMPETITIVA-CONCORRENTES.md` | ⚠️ `/checkName` existe mas só valida username |

---

## 🔐 Credenciais de teste (DB local)

Geradas via `npm run init-db`:

| Tipo | Username | Senha |
|---|---|---|
| Admin | `admin` | `MercadoGamer2024!` |
| Vendedor (sem phone) | `vendedor1` | `vendedor123` |
| Comprador (criado via curl no smoke test) | `testuser01` | `Teste1234!` |

⚠️ **Trocar antes de qualquer deploy de produção.**

---

## 🐛 Bugs conhecidos (não-bloqueantes)

| # | Descrição | Impacto | Fix sugerido |
|---|---|---|---|
| 9 | Vários helpers fazem `res.send()` + `reject()` (antipattern) | gera `ERR_HTTP_HEADERS_SENT` no log; usuário recebe resposta correta | Refactor — helpers devem só rejeitar, deixar route enviar |
| 10 | `/ipn` (MercadoPago) faz `JSON.parse(external_reference)` — não é JSON | endpoint deprecado, `/ipnv2` é o usado | Comentar ou remover endpoint legado |
| 11 | `multer@1.x` deprecated | sem vuln crítica conhecida, mas convém subir | `multer@2.x` quando der |
| 12 | `helpers/files/upload.js` deixa temp file se sharp falhar | leak de disco em edge case | `fs.unlink` no catch também |
| 13 | `app.js` cron loading order é frágil (period reading) | currencies cron funciona, novos crons podem ter problema | Refactor de loader |

---

## 🚀 Como rodar (Windows)

```powershell
# 1. Backend (terminal 1)
cd C:\Users\Thiago\Desktop\marketplace\MercadoGamer-Backend-main\MercadoGamer-Backend-main\api
npm install               # primeira vez
npm run init-db           # primeira vez — popula Brasil + admin
npm run local             # sobe API na :3000

# 2. Frontend Web (terminal 2)
cd C:\Users\Thiago\Desktop\marketplace\MercadoGamer
npm install               # primeira vez
npx nx serve web          # sobe Next.js na :4200

# 3. (opcional) Frontend Admin (terminal 3)
cd C:\Users\Thiago\Desktop\marketplace\MercadoGamer
npx nx serve admin        # sobe admin na :4300

# Acessar
# Frontend público:   http://localhost:4200
# Painel admin:       http://localhost:4300
# API:                http://localhost:3000/api
# Health check:       http://localhost:3000/api/health
```

---

## 📈 Histórico de mudanças

| Data | Mudança | Commit |
|---|---|---|
| 27/05/2026 | Migração completa Node 18→22, Mongoose 5→8, Socket.IO 2→4, Babel→nativo, bcrypt→bcryptjs, Next 13→14, Nx 15→19 | `179a4a0` (frontend), `1dd9778` (backend) |
| 27/05/2026 | Fase 3: connect-multiparty→multer, MP 1→2, Stripe 8→18, axios 0→1, @google/maps→@googlemaps/google-maps-services-js, removido fcm-node morto | pendente commit |
| 27/05/2026 | Etapa 0: smoke test 28 endpoints, bugs de trust-proxy + JSON.parse undefined corrigidos | pendente commit |
| 04/11/2025 | Trabalho anterior do consultor — docs estratégicos + componentes React + middleware de segurança | repo histórico |
