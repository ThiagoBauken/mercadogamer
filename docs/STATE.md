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
| next-i18next | 15.4 | ⚠️ infra pronta, não plugada em `_app.tsx` |
| styled-components | 6.1 | ✅ (via SWC do Next 14) |
| Apps | `apps/web` (port 4200), `apps/admin` (port 4300) | ✅ web testado, admin não testado |

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

## 🔴 O que NÃO está implementado (zero código)

| Feature | Documentado em | Status |
|---|---|---|
| **KYC** (CPF, SMS, foto, biometria) | `GUIA-IMPLEMENTACAO-KYC.md` (2.363 linhas) | ❌ 0% |
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
