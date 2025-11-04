# 🚀 Deploy no Easypanel - MercadoGamer

Guia completo para fazer deploy do MercadoGamer no Easypanel.

## 📋 Pré-requisitos

- Conta no [Easypanel](https://easypanel.io)
- Código no GitHub (este repositório)
- Domínio configurado (opcional)

## 🏗️ Arquitetura no Easypanel

```
┌─────────────────────────────────────┐
│  Easypanel Project: mercadogamer    │
├─────────────────────────────────────┤
│  ├─ App: backend (Express.js)       │
│  ├─ App: frontend-web (Angular)     │
│  ├─ App: frontend-admin (Angular)   │
│  └─ Database: MongoDB               │
└─────────────────────────────────────┘
```

## 📝 Passo a Passo

### 1️⃣ Criar Projeto no Easypanel

1. Faça login no Easypanel
2. Clique em **"Create Project"**
3. Nome: `mercadogamer`
4. Clique em **"Create"**

---

### 2️⃣ Criar MongoDB Database

1. Dentro do projeto, clique em **"+ Add Service"**
2. Escolha **"Database" → "MongoDB"**
3. Configuração:
   - **Name**: `mercadogamer-mongodb`
   - **Version**: `7.0`
   - **Username**: `admin`
   - **Password**: `MercadoGamer2024!` (ou gere uma senha segura)
   - **Database Name**: `mercadogamer`
4. Clique em **"Create"**
5. ⏳ Aguarde o MongoDB iniciar (1-2 min)

---

### 3️⃣ Criar Backend API

1. Clique em **"+ Add Service" → "App"**
2. Escolha **"Git Repository"**
3. Conecte ao GitHub e selecione este repositório
4. Configuração:

**General:**
- **Name**: `backend`
- **Branch**: `main` (ou a branch que você quer)
- **Build Path**: `/MercadoGamer-Backend-main/MercadoGamer-Backend-main/api`

**Build:**
- **Dockerfile**: `Dockerfile`
- **Build Args**: (deixe vazio)

**Environment Variables:**
```env
NODE_ENV=production
DATABASE_HOST=private_mercadogamer-mongodb:27017
DATABASE_NAME=mercadogamer
BASE_URL=https://seu-dominio.com
FRONTEND_URL=https://seu-dominio.com
UPLOAD_DIR=/app/uploads
IMAGES_DIR=/app/files

# Pagamentos (adicione quando tiver as credenciais)
MP_ACCESS_TOKEN=
STRIPE_KEY=

# Email (configure se precisar)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# JWT
JWT_SECRET=change_this_to_random_secure_string_in_production
```

**Domains:**
- **Port**: `3000`
- **Domain**: Clique em "Generate Domain" ou adicione seu domínio customizado
- Exemplo: `backend.seu-dominio.com` ou use o gerado: `backend-xxx.easypanel.host`

**Resources:**
- **CPU**: 0.5 vCPU (ajuste conforme necessário)
- **Memory**: 512 MB (aumente se necessário)

5. Clique em **"Create"**
6. ⏳ Aguarde o build (5-10 min na primeira vez)

---

### 4️⃣ Criar Frontend Web (Marketplace)

1. Clique em **"+ Add Service" → "App"**
2. Escolha **"Git Repository"**
3. Selecione o mesmo repositório
4. Configuração:

**General:**
- **Name**: `frontend-web`
- **Branch**: `main`
- **Build Path**: `/MercadoGamer-Backend-main/MercadoGamer-Backend-main/web`

**Build:**
- **Dockerfile**: `Dockerfile.prod`

**Environment Variables:**
```env
NODE_ENV=production
```

**Domains:**
- **Port**: `80` (nginx serve na porta 80)
- **Domain**: Seu domínio principal
- Exemplo: `mercadogamer.com` ou `web-xxx.easypanel.host`

**IMPORTANTE:** Antes do build, você DEVE atualizar `/web/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  serverUrl: 'https://backend.seu-dominio.com/api',  // ← URL do backend
  filesUrl: 'https://backend.seu-dominio.com/files',
  chatUrl: 'https://backend.seu-dominio.com',
};
```

5. Clique em **"Create"**
6. ⏳ Aguarde o build (5-10 min)

---

### 5️⃣ Criar Frontend Admin

1. Clique em **"+ Add Service" → "App"**
2. Escolha **"Git Repository"**
3. Selecione o mesmo repositório
4. Configuração:

**General:**
- **Name**: `frontend-admin`
- **Branch**: `main`
- **Build Path**: `/MercadoGamer-Backend-main/MercadoGamer-Backend-main/adm`

**Build:**
- **Dockerfile**: `Dockerfile.prod`

**Environment Variables:**
```env
NODE_ENV=production
```

**Domains:**
- **Port**: `80`
- **Domain**: Subdomínio para admin
- Exemplo: `admin.mercadogamer.com` ou `admin-xxx.easypanel.host`

**IMPORTANTE:** Antes do build, atualize `/adm/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  serverUrl: 'https://backend.seu-dominio.com/api',  // ← URL do backend
  filesUrl: 'https://backend.seu-dominio.com/files',
  chatUrl: 'https://backend.seu-dominio.com',
};
```

5. Clique em **"Create"**
6. ⏳ Aguarde o build (5-10 min)

---

## ✅ Verificação Pós-Deploy

### 1. Backend Health Check

Acesse: `https://backend.seu-dominio.com/api/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-11-04T..."
}
```

### 2. Frontend Web

Acesse: `https://mercadogamer.com` (ou seu domínio)
- Deve carregar a página inicial
- Abra o console do navegador (F12)
- Não deve ter erros de conexão com API

### 3. Frontend Admin

Acesse: `https://admin.mercadogamer.com`
- Deve carregar a página de login
- Verifique console sem erros

---

## 🔧 Configurações Adicionais

### SSL/HTTPS

O Easypanel configura SSL automaticamente com Let's Encrypt para domínios customizados.

### Volumes (Uploads)

O backend já cria os diretórios `/app/files` e `/app/uploads` automaticamente.

No Easypanel, os uploads são persistidos no container. Para persistência entre deploys:
1. Vá em **backend → Volumes**
2. Adicione um volume:
   - **Mount Path**: `/app/files`
   - **Size**: 10 GB (ajuste conforme necessário)

### Logs

Para ver logs:
1. Clique no serviço (backend, frontend-web, ou frontend-admin)
2. Vá na aba **"Logs"**
3. Escolha "Live Logs" ou "Historical"

---

## 🐛 Troubleshooting

### Backend não inicia

**Problema**: Container fica reiniciando

**Solução**:
1. Verifique logs do backend
2. Confirme que MongoDB está rodando
3. Verifique variáveis de ambiente (DATABASE_HOST deve ser `private_mercadogamer-mongodb:27017`)

### Frontend mostra página branca

**Problema**: Build do Angular falhou ou environment está errado

**Solução**:
1. Verifique logs do build
2. Confirme que `environment.prod.ts` tem URLs corretas do backend
3. Rebuild: Vá no serviço → Settings → "Rebuild"

### Erro de CORS

**Problema**: Frontend não consegue conectar com backend

**Solução**:
1. Verifique se o backend CORS está permitindo o domínio do frontend
2. No código do backend, `/api/app.js` linha 196-206 já permite todas origens em production
3. Certifique-se que `NODE_ENV=production` no backend

### MongoDB connection failed

**Problema**: Backend não conecta no MongoDB

**Solução**:
1. Verifique se MongoDB está rodando (status verde no Easypanel)
2. Confirme `DATABASE_HOST=private_mercadogamer-mongodb:27017` no backend
3. Use o prefixo `private_` para conexão interna no Easypanel

---

## 🔄 Atualizações/Redeploy

Quando fizer mudanças no código:

1. **Push para o GitHub**:
   ```bash
   git add .
   git commit -m "feat: sua mudança"
   git push
   ```

2. **No Easypanel**:
   - Vá no serviço que você alterou
   - Clique em **"Settings" → "Redeploy"**
   - Ou configure **Auto Deploy** (deploy automático ao push)

---

## 📊 Monitoramento

### Métricas

No Easypanel você pode ver:
- CPU usage
- Memory usage
- Network traffic
- Request logs

### Alertas

Configure alertas para:
- Alto uso de CPU/Memória
- Container down
- Erros 5xx

---

## 💰 Custos Estimados

Easypanel cobra por recursos utilizados:

| Serviço | CPU | RAM | Storage | Custo/mês* |
|---------|-----|-----|---------|------------|
| Backend | 0.5 | 512MB | 1GB | ~$5 |
| Frontend Web | 0.25 | 256MB | 100MB | ~$2 |
| Frontend Admin | 0.25 | 256MB | 100MB | ~$2 |
| MongoDB | 0.5 | 512MB | 10GB | ~$7 |
| **TOTAL** | | | | **~$16/mês** |

*Valores aproximados, verifique preços atualizados no Easypanel

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Easypanel
2. Consulte a [documentação do Easypanel](https://easypanel.io/docs)
3. Abra uma issue no repositório

---

**Desenvolvido com ❤️ pela equipe MercadoGamer**
