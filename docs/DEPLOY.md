# 🚀 Deploy do MercadoGamer

Guia atualizado de deploy em produção. Reflete o estado pós-migração (Node 22, Mongoose 8, Socket.IO 4, Next 14, Nx 19, KYC + Escrow + Disputas).

---

## 🐳 Deploy local com Docker (mais simples — uma máquina)

Pra rodar **TUDO** numa máquina só (Backend + Mongo + Web + Admin + Mailhog) usando Docker:

### Pré-requisitos
- **Docker Desktop** instalado (Windows/Mac) ou Docker Engine + Compose plugin (Linux)
  - Windows: https://www.docker.com/products/docker-desktop/ (precisa WSL2 ativado)
  - Linux: `curl -fsSL https://get.docker.com | sh`
- ~4 GB RAM livres pra rodar os 5 containers

### Como rodar

```bash
cd C:\Users\Thiago\Desktop\marketplace

# 1. Criar .env na raiz com as variáveis necessárias
# (use docker-compose.yml como referência — todas as ${VAR:-} são opcionais)
echo 'JWT_SECRET=algo-super-secreto' > .env
echo 'ALLOWED_ORIGINS=http://localhost:3001,http://localhost:4300' >> .env

# 2. Build + sobe tudo (primeira vez demora ~5min)
docker compose up -d --build

# 3. Aguardar containers ficarem healthy (~30s)
docker compose ps

# 4. Inicializar o banco (cria país Brasil + admin + user de teste)
docker compose exec backend npm run init-db

# 5. Testar
curl http://localhost:3000/api/health         # backend
curl -I http://localhost:3001/                # frontend web
curl -I http://localhost:4300/login           # frontend admin
```

**URLs acessíveis** após `docker compose up`:
- Site público: http://localhost:3001
- Admin panel: http://localhost:4300
- API: http://localhost:3000/api
- Mailhog (capturar emails enviados pelo backend): http://localhost:8025
- MongoDB: localhost:27017 (acessível via Mongo Compass / mongosh)

### Comandos úteis

```bash
docker compose logs -f backend         # ver logs do backend ao vivo
docker compose logs -f frontend-web    # logs do site
docker compose down                    # parar tudo (sem apagar dados)
docker compose down -v                 # parar + apagar volumes (MongoDB zera)
docker compose restart backend         # reiniciar só o backend
docker compose exec backend sh         # entrar no container backend
docker compose build --no-cache backend  # rebuild forçado se Dockerfile mudou
```

### Variáveis pra `.env` (opcionais — vazias = modo MOCK)

```bash
# Pagamento
MP_ACCESS_TOKEN=APP_USR-xxxxx              # produção MercadoPago
STRIPE_LIVE_SECRET_KEY=sk_live_xxxxx       # produção Stripe
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# KYC real (sem isso, valida só checksum local)
SERPRO_API_TOKEN=xxxxx

# SMS real (sem isso, code do KYC é logado no console)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+5511xxxxx

# Auth
JWT_SECRET=$(openssl rand -base64 64)
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:4300

# Escrow
ESCROW_HOLD_DAYS=3
```

### Troubleshooting Docker

| Sintoma | Fix |
|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop não está rodando → abrir Docker Desktop |
| `port is already allocated` | Outro processo na porta → `netstat -ano | findstr :3000` e mata |
| Container `backend` em `restarting` infinito | `docker compose logs backend` — geralmente MongoDB ainda inicializando, espere |
| `EACCES` em `/app/files` | Volume permissão — `docker compose down -v && up -d` |
| Build muito lento | Primeira vez baixa imagens (~500MB) — depois usa cache |

---

## 🏛️ Arquitetura de produção recomendada

```
┌────────────────────────────────────────────────────────┐
│ Cloudflare (DNS + CDN + SSL automático + DDoS)         │
└────────────────────────┬───────────────────────────────┘
                         │
       ┌─────────────────┼─────────────────────┐
       │                 │                     │
┌──────▼──────┐  ┌──────▼──────┐    ┌────────▼─────────┐
│ Web (Vercel)│  │ Admin       │    │ Backend API      │
│ Next.js 14  │  │ (Vercel)    │    │ (Easypanel)      │
│ mercadogamer│  │ admin.mg.com│    │ api.mg.com:443   │
│   .com.br   │  │             │    │ Node 22 + Express│
└─────────────┘  └─────────────┘    └────────┬─────────┘
                                              │
                                    ┌─────────▼────────────┐
                                    │ MongoDB Atlas        │
                                    │ M0 free (512 MB)     │
                                    │ ou M10 (~R$60/mês)   │
                                    └──────────────────────┘
```

**Por que assim**:
- **Vercel pro frontend**: free tier robusto, deploys automáticos via git, SSL grátis, edge CDN. Suporta Next 14 nativamente.
- **Easypanel pro backend**: você já paga, Docker funciona, MongoDB pode ficar lá perto.
- **MongoDB Atlas separado**: managed, backup automático diário, mais seguro que rodar no mesmo VPS (que pode cair).
- **Cloudflare na frente**: SSL grátis, DDoS protection, cache estático.

**Alternativa low-cost**: tudo no Easypanel — Backend + 2 frontends + MongoDB. Funciona. O risco é deploy de qualquer coisa derrubar o resto e backup ser manual.

---

## ✅ Pré-requisitos antes do deploy

- [ ] Domínio comprado (.com.br via Registro.br ~R$60/ano, ou .com via Namecheap ~R$50/ano)
- [ ] Conta Cloudflare criada (free) com domínio apontado
- [ ] Easypanel rodando (você já tem)
- [ ] MongoDB Atlas: conta criada + cluster M0 (free) ou superior
- [ ] (Opcional) Conta Vercel para frontend
- [ ] Tokens das APIs de pagamento e KYC (ver lista abaixo)

---

## 🔑 Variáveis de ambiente necessárias

### Backend (`api/.env`)

| Variável | Crítica? | Como obter |
|---|---|---|
| `NODE_ENV` | ✅ sim | `production` |
| `DATABASE_HOST` | ✅ sim | Atlas → Connect → Drivers → copie o host (sem `mongodb://`) |
| `DATABASE_NAME` | ✅ sim | `mercadogamer` |
| `MONGO_USER` | ✅ sim | Usuário criado no Atlas |
| `MONGO_PASSWORD` | ✅ sim | Senha do Atlas (gere forte com `openssl rand -hex 32`) |
| `JWT_SECRET` | ✅ sim | Gere: `openssl rand -base64 64`. **NUNCA reuse o default** |
| `ALLOWED_ORIGINS` | ✅ sim | `https://mercadogamer.com.br,https://admin.mercadogamer.com.br` |
| `FRONTEND_URL` | ✅ sim | `https://mercadogamer.com.br` (usado em links de verificação) |
| `BASE_URL` | médio | `https://api.mercadogamer.com.br` |
| `UPLOAD_DIR` | sim | `/app/uploads` (Docker) ou `./uploads` (local) |
| `IMAGES_DIR` | sim | `/app/files` (Docker) ou `./files` (local) |
| `PORT` | sim | `3000` |
| **Pagamento — pra funcionar de verdade**: |  |  |
| `MP_ACCESS_TOKEN` | só pra MP | Dashboard MercadoPago → Credenciais → Production |
| `STRIPE_LIVE_SECRET_KEY` | só pra Stripe | Dashboard Stripe → API Keys → Live |
| `STRIPE_WEBHOOK_SECRET` | só pra Stripe | Stripe → Webhooks → adicionar endpoint + revelar secret |
| **KYC — pra validar CPF real**: |  |  |
| `SERPRO_API_TOKEN` | só pra Serpro real | gov.br/conecta → catálogo APIs → CPF. Sem isso, modo MOCK |
| **SMS — pra mandar de verdade**: |  |  |
| `TWILIO_ACCOUNT_SID` | só pra Twilio | Console Twilio |
| `TWILIO_AUTH_TOKEN` | só pra Twilio | Console Twilio |
| `TWILIO_PHONE_NUMBER` | só pra Twilio | Compre número no Twilio |
| **Email**: |  |  |
| `SMTP_HOST` | sim | Resend (smtp.resend.com), Mailgun, SES, etc |
| `SMTP_PORT` | sim | `587` (TLS) ou `465` (SSL) |
| `SMTP_USER` | sim | (varia por provider) |
| `SMTP_PASS` | sim | (varia por provider) |
| `SMTP_FROM` | sim | `no-reply@mercadogamer.com.br` |
| **Escrow** (opcional, defaults OK): |  |  |
| `ESCROW_HOLD_DAYS` | não | `3` |
| `ESCROW_CRON_PERIOD` | não | `0 0 * * * *` |

### Frontend (Next.js — Vercel ou Easypanel)

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `https://api.mercadogamer.com.br/api` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://api.mercadogamer.com.br` |
| `NEXT_PUBLIC_FILE_URL` | `https://api.mercadogamer.com.br/files` |
| `NEXT_PUBLIC_DOMAIN` | `https://mercadogamer.com.br` |
| `NODE_ENV` | `production` |

**IMPORTANTE**: variáveis com `NEXT_PUBLIC_` são embedadas no bundle (visíveis no client). Não bote secret aí.

---

## 📋 Roteiro de deploy passo a passo

### Etapa 1 — MongoDB Atlas (~15 min)

1. Criar conta em https://www.mongodb.com/cloud/atlas
2. Criar cluster:
   - Tier M0 free (512 MB, ok até ~5k usuários) ou M10 (~R$60/mês, melhor)
   - Região: `sa-east-1` (São Paulo) pra latência baixa BR
   - Auth: criar user `mercadogamer` com senha forte
3. Network Access:
   - Inicialmente `0.0.0.0/0` pra testar
   - Depois restringir pra IP do Easypanel + Vercel
4. Connect → Drivers → copiar o connection string. Ex:
   ```
   mongodb+srv://mercadogamer:<password>@cluster0.xxxx.mongodb.net/mercadogamer?retryWrites=true&w=majority
   ```
5. Rodar o init-db **localmente** uma vez apontando pro Atlas:
   ```bash
   cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
   # editar .env com credenciais Atlas
   npm run init-db
   ```
   Isso popula Brasil + cria admin/vendedor de teste.

### Etapa 2 — Backend no Easypanel (~20 min)

1. No painel Easypanel, **Create New Service** → tipo `App`
2. Source: **Git repository**
   - URL: `https://github.com/ThiagoBauken/mercadogamer.git`
   - Branch: `main`
   - **Build context**: `MercadoGamer-Backend-main/MercadoGamer-Backend-main/api`
   - **Dockerfile**: `Dockerfile.production`
3. Domain:
   - Subdomain: `api`
   - Bind a domínio `mercadogamer.com.br`
   - **Force HTTPS**: ON (Easypanel gera certificado Let's Encrypt automático)
4. Port: `3000` (interno) → `443` HTTPS externo
5. **Environment Variables**: cole todas as variáveis da seção anterior. Use o painel de envs, **não** comite `.env` no repo.
6. **Mounts** (importante):
   - `/app/uploads` → volume persistente
   - `/app/files` → volume persistente
   - Sem isso, uploads de imagens se perdem em cada redeploy.
7. **Resources**: 512 MB RAM, 1 CPU inicial (escalável depois)
8. **Health check**: já configurado no Dockerfile (`/api/health`)
9. Deploy → aguardar build (~3-5 min na primeira vez)
10. Testar: `curl https://api.mercadogamer.com.br/api/health` → deve responder `{"status":"ok","mongodb":"connected"}`

### Etapa 3 — Frontend Web no Vercel (~10 min)

**Por que Vercel ao invés de Easypanel pra Next.js**:
- Build otimizado pra Next nativamente
- Edge CDN global incluso
- Preview deploys por PR (qualidade)
- Free tier robusto (100 GB bandwidth/mês)

1. https://vercel.com → New Project
2. Import git: `ThiagoBauken/mercadogamer`
3. Configure:
   - **Root Directory**: `MercadoGamer`
   - **Framework Preset**: Next.js
   - **Build Command**: `npx nx build web --configuration=production`
   - **Output Directory**: `dist/apps/web/.next`
   - **Install Command**: `npm install`
4. Environment Variables (cole as do bloco anterior do frontend)
5. Domain:
   - Adicionar `mercadogamer.com.br` (apex)
   - Adicionar `www.mercadogamer.com.br`
   - Vercel mostra os registros DNS que você precisa configurar no Cloudflare/Registro.br
6. Deploy → aguardar (~3-5 min)
7. Testar: `https://mercadogamer.com.br/` → homepage carrega

### Etapa 4 — Frontend Admin no Vercel (mesmo padrão)

1. New Project (separado do web)
2. Root: `MercadoGamer`, Build: `npx nx build admin --configuration=production`
3. Output: `dist/apps/admin/.next`
4. Domain: `admin.mercadogamer.com.br`
5. Variables idem ao web

### Etapa 5 — Cloudflare na frente (~5 min)

1. Adicionar domínio em https://dash.cloudflare.com
2. Apontar nameservers do Registro.br pros do Cloudflare (instruções na hora)
3. **SSL/TLS Mode**: `Full (strict)` (Vercel + Easypanel já têm cert)
4. **Always Use HTTPS**: ON
5. **Auto Minify**: HTML/CSS/JS = ON
6. **Brotli**: ON
7. **Cache**: padrão Cloudflare é ok

### Etapa 6 — Domínio configurado

DNS records que devem existir após Cloudflare aprender (verificar com `dig` ou nslookup):

```
mercadogamer.com.br         A     <Vercel IP>
www.mercadogamer.com.br     CNAME cname.vercel-dns.com
admin.mercadogamer.com.br   CNAME cname.vercel-dns.com
api.mercadogamer.com.br     A     <Easypanel IP>
```

---

## 🧪 Smoke test pós-deploy

Após tudo no ar, rodar via terminal:

```bash
# 1. Health backend
curl https://api.mercadogamer.com.br/api/health
# esperado: {"status":"ok","mongodb":"connected"}

# 2. Login com vendedor de teste (criado no init-db)
curl -X POST https://api.mercadogamer.com.br/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"vendedor1","password":"vendedor123"}'
# esperado: HTTP 200 com token JWT

# 3. Frontend home
curl -I https://mercadogamer.com.br/
# esperado: HTTP/2 200, content-type text/html

# 4. WebSocket
curl "https://api.mercadogamer.com.br/socket.io/?EIO=4&transport=polling"
# esperado: HTTP 200 com sid

# 5. KYC status (auth)
TOKEN=$(curl -s -X POST https://api.mercadogamer.com.br/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"vendedor1","password":"vendedor123"}' \
  | grep -oE '"token":"[^"]+"' | sed 's/"token":"//;s/"$//')
curl https://api.mercadogamer.com.br/api/kyc/status -H "x-access-token: $TOKEN"
# esperado: {"kycLevel":0,"checklist":{...},...}
```

---

## 🔒 Hardening de segurança pós-deploy

Antes de divulgar o site, fazer:

- [ ] Trocar senha do admin padrão (`MercadoGamer2024!` → algo único)
- [ ] Restringir MongoDB Atlas Network Access pra IPs específicos (não `0.0.0.0/0`)
- [ ] Adicionar 2FA na conta Easypanel + Vercel + Atlas + Cloudflare
- [ ] Configurar **Sentry** (free tier) pra capturar erros — adicionar `SENTRY_DSN` no .env
- [ ] Configurar **UptimeRobot** (free tier) pra monitorar `/api/health` a cada 5min
- [ ] Backup MongoDB: já vem ativo no Atlas (point-in-time recovery em planos pagos)
- [ ] Logs do Easypanel: ativar persistência (ele tem opção)
- [ ] Habilitar **rate-limit** mais agressivo via Cloudflare (ex: 100 req/min por IP em /api/auth/*)

---

## 🆘 Troubleshooting de deploy

| Sintoma | Causa provável | Fix |
|---|---|---|
| Backend não sobe — `MongoDB connection error` | DATABASE_HOST errado ou Atlas Network Access bloqueado | Conferir string, liberar IP do Easypanel |
| Backend sobe mas /api/health responde MongoDB disconnected | MONGO_USER ou senha errados | Conferir Atlas → Database Access |
| Frontend 500 em produção mas funciona local | Variável `NEXT_PUBLIC_SERVER_URL` não setada no Vercel | Adicionar e fazer redeploy |
| CORS error no console do navegador | `ALLOWED_ORIGINS` não inclui o domínio de produção | Atualizar e restart backend |
| Upload de imagem 500 | Volumes `/app/files` e `/app/uploads` não montados | Adicionar volumes no Easypanel |
| Socket.IO não conecta | Cloudflare bloqueando WebSocket | No Cloudflare → Network → WebSockets ON |
| Login funciona mas perfil retorna 401 | Frontend manda `Authorization: Bearer` em vez de `x-access-token` | Já corrigido no client atual (axios wrapper) |
| Pagamento Stripe/MP falha 401/UNAUTHORIZED | Tokens de teste em produção (ou vice-versa) | Confirmar STRIPE_LIVE_* vs STRIPE_TEST_* |
| Cron de escrow não roda | `ESCROW_CRON_DISABLED=true` no env | Remover ou setar `false` |

---

## 💰 Custo mensal estimado (PRODUÇÃO)

| Item | Mensal |
|---|---|
| Domínio (.com.br anual) | R$ 5 (~R$60/ano ÷ 12) |
| Cloudflare | R$ 0 |
| Vercel (web + admin frontends) | R$ 0 (free tier ate ~100GB bandwidth/mês) |
| Easypanel (backend) | R$ 25-60 (você já paga) |
| MongoDB Atlas M0 (512MB) | R$ 0 |
| MongoDB Atlas M10 (recomendado prod) | R$ 60 |
| Resend (email transacional 3k/mês) | R$ 0 (free tier) |
| Twilio SMS | ~R$ 0,25/SMS — orçar conforme volume |
| Serpro CPF | ~R$ 0,05/consulta — orçar conforme volume |
| Stripe | 4,99% por transação (não fixo) |
| **Total fixo** | **R$ 30-130/mês** |
| + variável por volume | + R$ 50-500 |

Comparação: rodar tudo num único VPS Hostinger seria R$ 30/mês, **mas sem MongoDB managed = você é responsável por backup, segurança, upgrades**. Não recomendo pra produção real.

---

## 📝 Pós-deploy

Quando estiver no ar:
1. Atualizar `docs/STATE.md` com URLs de produção
2. Criar runbook de incidentes em `docs/RUNBOOK.md` (próxima feature)
3. Configurar alertas de erro (Sentry → Slack/Discord)
4. Documentar processo de hotfix (git → CI → Vercel/Easypanel)
