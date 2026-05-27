# 🚀 Guia de Deploy - MercadoGamer no Easypanel

Este guia detalha o processo completo de deploy do MercadoGamer no Easypanel, desde a preparação até a configuração final.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Arquitetura do Deploy](#arquitetura-do-deploy)
3. [Preparação dos Repositórios](#preparação-dos-repositórios)
4. [Deploy do MongoDB](#deploy-do-mongodb)
5. [Deploy do Backend API](#deploy-do-backend-api)
6. [Deploy do Frontend Web](#deploy-do-frontend-web)
7. [Deploy do Frontend Admin](#deploy-do-frontend-admin)
8. [Configuração de Domínios](#configuração-de-domínios)
9. [Configuração de Pagamentos](#configuração-de-pagamentos)
10. [Testes e Verificação](#testes-e-verificação)
11. [Troubleshooting](#troubleshooting)

---

## ✅ Pré-requisitos

- [ ] Conta no Easypanel configurada
- [ ] Repositório Git (GitHub, GitLab ou Bitbucket)
- [ ] Tokens de pagamento (MercadoPago, Stripe, NOWPayments)
- [ ] Configuração SMTP para emails
- [ ] Domínio próprio (opcional, pode usar domínio do Easypanel)

---

## 🏗️ Arquitetura do Deploy

O MercadoGamer é composto por 4 serviços principais:

```
┌─────────────────────────────────────────────────┐
│                   EASYPANEL                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │   Frontend   │      │   Frontend   │        │
│  │     Web      │      │    Admin     │        │
│  │   (Port 80)  │      │  (Port 80)   │        │
│  └──────┬───────┘      └──────┬───────┘        │
│         │                     │                 │
│         └──────────┬──────────┘                 │
│                    │                            │
│         ┌──────────▼───────────┐                │
│         │    Backend API       │                │
│         │  (Express + Socket)  │                │
│         │     (Port 3000)      │                │
│         └──────────┬───────────┘                │
│                    │                            │
│         ┌──────────▼───────────┐                │
│         │      MongoDB         │                │
│         │     (Port 27017)     │                │
│         └──────────────────────┘                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📦 Preparação dos Repositórios

### Opção 1: Repositório Único (Monorepo) - RECOMENDADO

Se você quer manter tudo em um repositório:

1. **Organize a estrutura:**
```
marketplace/
├── backend/                          # Backend API
│   ├── Dockerfile.production
│   ├── package.json
│   └── ...
├── frontend/                         # Frontend (monorepo Nx)
│   ├── Dockerfile.web.production
│   ├── Dockerfile.admin.production
│   ├── apps/
│   │   ├── web/
│   │   └── admin/
│   └── ...
├── DEPLOY-EASYPANEL.md
└── .env.easypanel.example
```

2. **Mova os Dockerfiles para os locais corretos:**

```bash
# Backend
cp MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/Dockerfile.production backend/

# Frontend
cp MercadoGamer/Dockerfile.web.production frontend/
cp MercadoGamer/Dockerfile.admin.production frontend/
```

### Opção 2: Repositórios Separados

Separe em 2-3 repositórios:
- `mercadogamer-backend` (API)
- `mercadogamer-frontend` (Web + Admin)
- Ou 3 repos separados se preferir

---

## 🗄️ Deploy do MongoDB

### Passo 1: Criar Serviço MongoDB

1. No Easypanel, clique em **"Create Service"**
2. Selecione **"App"**
3. Escolha **"MongoDB"** do catálogo ou configure manualmente:

```yaml
# Configuração Manual
Image: mongo:7.0
Port: 27017
```

4. **Configure as variáveis de ambiente:**
```env
MONGO_INITDB_DATABASE=mercadogamer
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=SuaSenhaSuperForte123!
```

5. **Configure Volume Persistente:**
   - Mount Path: `/data/db`
   - Size: 10GB (ajuste conforme necessário)

6. **Configurações de Rede:**
   - Enable Private Network: ✅ SIM
   - Nome do serviço: `mongodb` (importante para DNS interno)

7. Clique em **"Deploy"**

---

## 🔧 Deploy do Backend API

### Passo 1: Criar Serviço Backend

1. No Easypanel, clique em **"Create Service"** → **"App"**
2. Selecione **"GitHub Repository"** (ou seu provedor Git)

### Passo 2: Configurar Repositório

```yaml
Repository: seu-usuario/mercadogamer
Branch: main
Build Context: MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
Dockerfile Path: Dockerfile.production
```

### Passo 3: Configurar Variáveis de Ambiente

Copie de `.env.easypanel.example` e configure:

```env
# Essenciais
NODE_ENV=production
DATABASE_HOST=mongodb:27017
DATABASE_NAME=mercadogamer
JWT_SECRET=gere-uma-chave-forte-aqui

# URLs (ajuste após configurar domínios)
BASE_URL=https://api.seudominio.com
SOCKET_SERVER_URL=https://api.seudominio.com
FRONTEND_URL=https://seudominio.com
ADMIN_URL=https://admin.seudominio.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=noreply@seudominio.com

# Pagamentos
MP_ACCESS_TOKEN=seu-token-mercadopago
STRIPE_KEY=sk_live_sua-chave-stripe
NOWPAYMENTS_API_KEY=sua-key-nowpayments

# Diretórios
UPLOAD_DIR=/app/uploads
IMAGES_DIR=/app/files
```

### Passo 4: Configurar Porta e Volumes

**Port Mapping:**
- Container Port: `3000`
- Protocol: `HTTP`

**Volumes:**
- `/app/files` → 5GB (para arquivos de produtos)
- `/app/uploads` → 2GB (para uploads temporários)

### Passo 5: Health Check

```yaml
Health Check Path: /api/health
Health Check Interval: 30s
```

### Passo 6: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 5-10 minutos na primeira vez)
3. Verifique os logs para erros

### Passo 7: Obter Domínio Temporário

Após o deploy, o Easypanel fornecerá um domínio como:
```
https://backend-abc123.easypanel.host
```

Anote este domínio, será necessário para configurar os frontends.

---

## 🎨 Deploy do Frontend Web (Marketplace)

### Passo 1: Criar Serviço Frontend Web

1. No Easypanel, clique em **"Create Service"** → **"App"**
2. Selecione **"GitHub Repository"**

### Passo 2: Configurar Repositório

```yaml
Repository: seu-usuario/mercadogamer
Branch: main
Build Context: MercadoGamer
Dockerfile Path: Dockerfile.web.production
```

### Passo 3: Configurar Variáveis de Ambiente

```env
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://backend-abc123.easypanel.host/api
NEXT_PUBLIC_SOCKET_URL=https://backend-abc123.easypanel.host
NEXT_PUBLIC_FILE_URL=https://backend-abc123.easypanel.host/files
NEXT_PUBLIC_DOMAIN=https://web-xyz789.easypanel.host
NEXT_PUBLIC_MP_PUBLIC_KEY=sua-chave-publica-mercadopago
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_sua-chave-stripe
NEXT_TELEMETRY_DISABLED=1
```

⚠️ **IMPORTANTE:** Use o domínio do backend anotado no passo anterior!

### Passo 4: Configurar Porta

**Port Mapping:**
- Container Port: `3000`
- Protocol: `HTTP`

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Build pode levar 10-15 minutos (Next.js + Nx)
3. Anote o domínio fornecido (ex: `https://web-xyz789.easypanel.host`)

---

## 👨‍💼 Deploy do Frontend Admin

### Passo 1: Criar Serviço Frontend Admin

1. No Easypanel, clique em **"Create Service"** → **"App"**
2. Selecione **"GitHub Repository"**

### Passo 2: Configurar Repositório

```yaml
Repository: seu-usuario/mercadogamer
Branch: main
Build Context: MercadoGamer
Dockerfile Path: Dockerfile.admin.production
```

### Passo 3: Configurar Variáveis de Ambiente

```env
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://backend-abc123.easypanel.host/api
NEXT_PUBLIC_SOCKET_URL=https://backend-abc123.easypanel.host
NEXT_PUBLIC_FILE_URL=https://backend-abc123.easypanel.host/files
NEXT_PUBLIC_DOMAIN=https://admin-def456.easypanel.host
NEXT_TELEMETRY_DISABLED=1
```

### Passo 4: Configurar Porta

**Port Mapping:**
- Container Port: `4300`
- Protocol: `HTTP`

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Anote o domínio fornecido (ex: `https://admin-def456.easypanel.host`)

---

## 🌐 Configuração de Domínios

### Fase 1: Testando com Domínios Easypanel

Agora você tem 3 domínios temporários:
- Backend: `https://backend-abc123.easypanel.host`
- Web: `https://web-xyz789.easypanel.host`
- Admin: `https://admin-def456.easypanel.host`

**Teste tudo antes de configurar domínio próprio!**

### Fase 2: Configurando Domínio Próprio

Quando estiver pronto para usar seu domínio:

#### 1. Configure DNS

No seu provedor de DNS (Cloudflare, GoDaddy, etc), adicione:

```
Tipo    Nome      Valor
A       @         IP-do-Easypanel
A       www       IP-do-Easypanel
CNAME   api       seu-app.easypanel.host
CNAME   admin     seu-app.easypanel.host
```

#### 2. Configure no Easypanel

Para cada serviço:

**Backend:**
- Custom Domain: `api.seudominio.com`
- SSL: ✅ Auto (Let's Encrypt)

**Frontend Web:**
- Custom Domain: `seudominio.com` e `www.seudominio.com`
- SSL: ✅ Auto (Let's Encrypt)

**Frontend Admin:**
- Custom Domain: `admin.seudominio.com`
- SSL: ✅ Auto (Let's Encrypt)

#### 3. Atualize Variáveis de Ambiente

**Backend:**
```env
BASE_URL=https://api.seudominio.com
SOCKET_SERVER_URL=https://api.seudominio.com
FRONTEND_URL=https://seudominio.com
ADMIN_URL=https://admin.seudominio.com
```

**Frontend Web:**
```env
NEXT_PUBLIC_SERVER_URL=https://api.seudominio.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.seudominio.com
NEXT_PUBLIC_FILE_URL=https://api.seudominio.com/files
NEXT_PUBLIC_DOMAIN=https://seudominio.com
```

**Frontend Admin:**
```env
NEXT_PUBLIC_SERVER_URL=https://api.seudominio.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.seudominio.com
NEXT_PUBLIC_FILE_URL=https://api.seudominio.com/files
NEXT_PUBLIC_DOMAIN=https://admin.seudominio.com
```

#### 4. Reinicie os Serviços

Restart cada serviço no Easypanel para aplicar as novas variáveis.

---

## 💳 Configuração de Pagamentos

### MercadoPago

1. Acesse: https://www.mercadopago.com.br/developers
2. Obtenha suas credenciais:
   - Access Token (Backend)
   - Public Key (Frontend)

3. Configure webhooks:
   - URL: `https://api.seudominio.com/api/mercadopago/webhook`
   - Eventos: `payment`, `merchant_order`

### Stripe

1. Acesse: https://dashboard.stripe.com/apikeys
2. Obtenha suas credenciais:
   - Secret Key (Backend)
   - Publishable Key (Frontend)
   - Webhook Secret

3. Configure webhooks:
   - URL: `https://api.seudominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`

### NOWPayments (Crypto)

1. Acesse: https://nowpayments.io/
2. Obtenha suas credenciais:
   - API Key
   - IPN Secret

3. Configure IPN:
   - URL: `https://api.seudominio.com/api/nowpayments/ipn`

---

## 🧪 Testes e Verificação

### Checklist Pós-Deploy

- [ ] **Backend API**
  - [ ] Health check funcionando: `https://api.seudominio.com/api/health`
  - [ ] Conexão com MongoDB estabelecida
  - [ ] Logs sem erros críticos

- [ ] **Frontend Web**
  - [ ] Página inicial carrega
  - [ ] Produtos são exibidos
  - [ ] Socket.IO conecta (verifique no console do navegador)
  - [ ] Login funciona
  - [ ] Carrinho funciona

- [ ] **Frontend Admin**
  - [ ] Página de login carrega
  - [ ] Login admin funciona
  - [ ] Dashboard exibe dados
  - [ ] CRUD de produtos funciona

- [ ] **Integrações**
  - [ ] Upload de imagens funciona
  - [ ] Emails são enviados
  - [ ] Pagamentos funcionam (teste com cartões de teste)
  - [ ] Notificações push funcionam

- [ ] **Performance**
  - [ ] Tempo de resposta < 2s
  - [ ] Imagens carregam rápido
  - [ ] Build está otimizado

### Comandos de Teste

```bash
# Health check Backend
curl https://api.seudominio.com/api/health

# Teste de conexão MongoDB (via logs do backend)
# Procure por: "✅ MongoDB conectado"

# Teste Socket.IO (console do navegador)
# Abra DevTools → Console
# Procure por: "Socket conectado" ou similar
```

---

## 🔧 Troubleshooting

### Problema: Backend não conecta ao MongoDB

**Sintomas:** Logs mostram erro de conexão

**Solução:**
```env
# Verifique se o nome do serviço MongoDB está correto
DATABASE_HOST=mongodb:27017  # Use o nome do serviço, não IP

# Se MongoDB tem autenticação:
DATABASE_HOST=mongodb://admin:senha@mongodb:27017
```

### Problema: Frontend não conecta ao Backend

**Sintomas:** Erros CORS, API não responde

**Solução:**
1. Verifique se `FRONTEND_URL` no backend está correto
2. Verifique se `NEXT_PUBLIC_SERVER_URL` no frontend está correto
3. Teste diretamente: `curl https://api.seudominio.com/api/health`

### Problema: Build do Frontend falha

**Sintomas:** Erro durante build no Easypanel

**Solução:**
```bash
# Verifique logs do build
# Erros comuns:

# 1. Memória insuficiente
# Solução: Aumente recursos do container no Easypanel

# 2. Variáveis NEXT_PUBLIC_ faltando
# Solução: Adicione todas as variáveis NEXT_PUBLIC_*

# 3. Dependências faltando
# Solução: Verifique package.json está completo
```

### Problema: Socket.IO não conecta

**Sintomas:** Console mostra erro de conexão WebSocket

**Solução:**
```env
# Backend
SOCKET_SERVER_URL=https://api.seudominio.com  # Sem trailing slash

# Frontend
NEXT_PUBLIC_SOCKET_URL=https://api.seudominio.com  # Sem trailing slash
```

### Problema: Imagens não carregam

**Sintomas:** 404 em `/files/*`

**Solução:**
1. Verifique volumes estão configurados: `/app/files`
2. Verifique `NEXT_PUBLIC_FILE_URL` está correto
3. Verifique permissões: `chmod -R 755 /app/files`

### Problema: Pagamentos não funcionam

**Sintomas:** Checkout falha, webhooks não recebem eventos

**Solução:**
1. Verifique se está usando credenciais de **PRODUÇÃO** (não teste)
2. Verifique URLs dos webhooks
3. Teste webhooks manualmente:
```bash
curl -X POST https://api.seudominio.com/api/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'
```

---

## 📊 Monitoramento

### Logs no Easypanel

Cada serviço tem logs em tempo real:
1. Abra o serviço no Easypanel
2. Clique em **"Logs"**
3. Filtre por erros: procure por `ERROR`, `FAIL`, etc

### Métricas

Monitor no Easypanel:
- CPU Usage
- Memory Usage
- Network I/O
- Disk Usage

**Alertas recomendados:**
- CPU > 80% por 5 minutos
- Memory > 90%
- Disk > 85%

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] JWT_SECRET é forte e único
- [ ] MongoDB tem autenticação habilitada
- [ ] SMTP usa senha de aplicativo (não senha real)
- [ ] Variáveis sensíveis NÃO estão no código
- [ ] HTTPS habilitado em todos os domínios
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo no backend
- [ ] Helmet.js configurado
- [ ] Backups automáticos do MongoDB

---

## 📈 Próximos Passos

Após o deploy bem-sucedido:

1. **Configure Backups**
   - MongoDB: backups diários
   - Volumes: snapshots semanais

2. **Configure CDN** (opcional)
   - Cloudflare para assets estáticos
   - Melhora performance global

3. **Configure Monitoramento**
   - UptimeRobot para uptime
   - Sentry para error tracking

4. **Configure CI/CD**
   - GitHub Actions para deploy automático
   - Testes automatizados

5. **Otimize Performance**
   - Caching com Redis
   - CDN para imagens
   - Database indexing

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de cada serviço
2. Consulte a documentação do Easypanel
3. Teste localmente com Docker Compose
4. Abra uma issue no repositório

---

## 📝 Checklist Final

**Antes de ir para produção:**

- [ ] Todos os serviços estão rodando
- [ ] Health checks passando
- [ ] Domínios configurados
- [ ] SSL ativo e válido
- [ ] Testes de pagamento realizados
- [ ] Emails sendo enviados
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Documentação atualizada
- [ ] Equipe treinada no Easypanel

---

**🎉 Parabéns! Seu MercadoGamer está no ar!**

Agora você pode acessar:
- Marketplace: https://seudominio.com
- Admin: https://admin.seudominio.com
- API: https://api.seudominio.com/api/health
