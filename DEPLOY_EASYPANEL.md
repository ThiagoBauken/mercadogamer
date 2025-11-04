# 🚀 Deploy no Easypanel - Guia Completo

## ✅ Status

**Git:** ✅ Inicializado e commit feito
**Arquivos:** 867 arquivos commitados
**Pronto para:** GitHub + Easypanel

---

## 📋 Passo 1: Criar Repositório no GitHub

### 1.1 No GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `mercadogamer`
   - **Description:** `Marketplace de jogos - Backend Express.js + Frontend Next.js`
   - **Visibility:** Private (recomendado) ou Public
   - ❌ **NÃO marque** "Initialize with README"
   - ❌ **NÃO adicione** .gitignore
   - ❌ **NÃO escolha** license
3. Clique em **"Create repository"**

### 1.2 Copiar a URL do Repositório

GitHub vai mostrar algo como:
```
https://github.com/SEU_USUARIO/mercadogamer.git
```

**Copie essa URL!**

---

## 📤 Passo 2: Enviar Código para GitHub

### 2.1 Conectar Repositório Local ao GitHub

Abra o terminal na pasta do projeto:

```bash
cd C:\Users\Thiago\Desktop\marketplace

# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/mercadogamer.git

# Verificar
git remote -v
```

### 2.2 Fazer Push

```bash
# Enviar código
git push -u origin master

# OU se pedir main:
git branch -M main
git push -u origin main
```

**Vai pedir login do GitHub:**
- Username: seu_usuario
- Password: use Personal Access Token (não a senha!)

### 2.3 Criar Personal Access Token (se necessário)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Marque: `repo` (full control)
4. Generate token
5. **Copie o token** (só aparece uma vez!)
6. Use como senha no `git push`

---

## 🐳 Passo 3: Deploy no Easypanel

### 3.1 Preparação

**Certifique-se:**
- ✅ MongoDB já criado no Easypanel
- ✅ Código no GitHub
- ✅ Acesso ao Easypanel

---

### 3.2 Deploy do Backend (API)

#### No Easypanel:

1. **Create New App/Service**
2. **Tipo:** `App`
3. **Source:**
   - **Repository:** `SEU_USUARIO/mercadogamer`
   - **Branch:** `master` (ou `main`)
   - **Build Path:** `MercadoGamer-Backend-main/MercadoGamer-Backend-main/api`

4. **Build Settings:**
   - **Builder:** Nixpacks ou Dockerfile
   - **Dockerfile Path:** `MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/Dockerfile`

5. **Environment Variables:**
   ```env
   NODE_ENV=production
   DATABASE_HOST=mercadogamer-mongodb:27017
   DATABASE_NAME=mercadogamer
   SOCKET_PORT_SOI=10111

   # MongoDB Auth (se configurou)
   MONGO_USER=admin
   MONGO_PASSWORD=MercadoGamer2024!

   # MercadoPago
   MP_ACCESS_TOKEN=seu_token_aqui

   # Stripe
   STRIPE_KEY=seu_token_aqui

   # Email (MailHog para teste ou SMTP real)
   SMTP_HOST=mailhog
   SMTP_PORT=1025
   ```

6. **Ports:**
   - **Container Port:** `3000` → **Public Port:** `3000`
   - **Container Port:** `10111` → **Public Port:** `10111`

7. **Deploy!**

---

### 3.3 Deploy do Frontend Web

#### No Easypanel:

1. **Create New App**
2. **Source:**
   - **Repository:** `SEU_USUARIO/mercadogamer`
   - **Branch:** `master`
   - **Build Path:** `MercadoGamer`

3. **Build Settings:**
   - **Dockerfile:** `MercadoGamer/Dockerfile.web`
   - **Build Command:** `npx nx build web`

4. **Environment Variables:**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_SERVER_URL=https://seu-backend.easypanel.host/api
   NEXT_PUBLIC_SOCKET_URL=https://seu-backend.easypanel.host
   NEXT_PUBLIC_FILE_URL=https://seu-backend.easypanel.host/files
   NEXT_PUBLIC_DOMAIN=https://seu-frontend.easypanel.host
   ```

5. **Port:**
   - **Container:** `3000`

6. **Deploy!**

---

### 3.4 Deploy do Frontend Admin

#### No Easypanel:

1. **Create New App**
2. **Source:**
   - **Repository:** `SEU_USUARIO/mercadogamer`
   - **Branch:** `master`
   - **Build Path:** `MercadoGamer`

3. **Build Settings:**
   - **Dockerfile:** `MercadoGamer/Dockerfile.admin`

4. **Environment Variables:**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_SERVER_URL=https://seu-backend.easypanel.host/api
   NEXT_PUBLIC_SOCKET_URL=https://seu-backend.easypanel.host
   NEXT_PUBLIC_FILE_URL=https://seu-backend.easypanel.host/files
   ```

5. **Port:**
   - **Container:** `4300`

6. **Deploy!**

---

## 🔧 Passo 4: Configurar Domínios (Opcional)

### No Easypanel:

Para cada app, você pode adicionar domínio customizado:

1. **Backend:**
   - Domínio: `api.mercadogamer.com`
   - SSL: Let's Encrypt (automático)

2. **Frontend Web:**
   - Domínio: `www.mercadogamer.com`
   - SSL: Let's Encrypt

3. **Frontend Admin:**
   - Domínio: `admin.mercadogamer.com`
   - SSL: Let's Encrypt

---

## 🎯 Passo 5: Verificação

### 5.1 Verificar Backend

```bash
# Acessar URL do backend
curl https://seu-backend.easypanel.host/api/health

# Ou no navegador
https://seu-backend.easypanel.host/api
```

### 5.2 Verificar Frontend

```
https://seu-frontend-web.easypanel.host
https://seu-frontend-admin.easypanel.host
```

### 5.3 Verificar Logs

No Easypanel:
- Abra cada app
- Clique em **Logs**
- Verifique se não há erros

---

## ⚙️ Configuração Adicional

### Variáveis de Ambiente Importantes

#### Backend (`api`):

```env
# Obrigatórias
DATABASE_HOST=mercadogamer-mongodb:27017
DATABASE_NAME=mercadogamer
NODE_ENV=production

# Pagamentos
MP_ACCESS_TOKEN=seu_token_mercadopago
STRIPE_KEY=seu_token_stripe

# Email Produção (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
SMTP_FROM=noreply@mercadogamer.com

# MongoDB com Auth
MONGO_USER=admin
MONGO_PASSWORD=sua_senha_forte
```

#### Frontend Web:

```env
NEXT_PUBLIC_SERVER_URL=https://api.mercadogamer.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.mercadogamer.com
NEXT_PUBLIC_FILE_URL=https://api.mercadogamer.com/files
NEXT_PUBLIC_DOMAIN=https://www.mercadogamer.com
```

#### Frontend Admin:

```env
NEXT_PUBLIC_SERVER_URL=https://api.mercadogamer.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.mercadogamer.com
NEXT_PUBLIC_FILE_URL=https://api.mercadogamer.com/files
```

---

## 🔍 Troubleshooting

### Problema: Build falha

**Solução:**
```bash
# Verifique o caminho do Dockerfile
# Verifique se as dependências estão no package.json
```

### Problema: Backend não conecta ao MongoDB

**Erro:**
```
MongoServerError: connect ECONNREFUSED
```

**Solução:**
```env
# Use o nome do serviço MongoDB (não localhost!)
DATABASE_HOST=mercadogamer-mongodb:27017
```

### Problema: Frontend não conecta ao Backend

**Solução:**
```env
# Use a URL pública do backend (não localhost!)
NEXT_PUBLIC_SERVER_URL=https://seu-backend.easypanel.host/api
```

### Problema: Erro de CORS

**Solução:**

No `api/app.js`, verificar configuração CORS:
```javascript
app.use(cors({
  origin: [
    'https://www.mercadogamer.com',
    'https://admin.mercadogamer.com',
    // Adicione outros domínios
  ],
  credentials: true
}));
```

---

## 📊 Estrutura de Deploy Final

```
Easypanel
├── mercadogamer-mongodb (MongoDB 7.0)
│   └── Porta: 27017 (interna)
│
├── mercadogamer-api (Backend)
│   ├── Dockerfile: api/Dockerfile
│   ├── Porta: 3000, 10111
│   └── URL: https://api.mercadogamer.com
│
├── mercadogamer-web (Frontend Web)
│   ├── Dockerfile: MercadoGamer/Dockerfile.web
│   ├── Porta: 3000
│   └── URL: https://www.mercadogamer.com
│
└── mercadogamer-admin (Frontend Admin)
    ├── Dockerfile: MercadoGamer/Dockerfile.admin
    ├── Porta: 4300
    └── URL: https://admin.mercadogamer.com
```

---

## ✅ Checklist de Deploy

### GitHub:
- [ ] Repositório criado
- [ ] Código enviado (`git push`)
- [ ] Repositório acessível

### Easypanel - MongoDB:
- [ ] MongoDB criado
- [ ] Porta 27017 disponível
- [ ] Usuário/senha configurados (se necessário)

### Easypanel - Backend:
- [ ] App criado
- [ ] Dockerfile configurado
- [ ] Environment variables configuradas
- [ ] Build com sucesso
- [ ] Deploy rodando
- [ ] Logs sem erros
- [ ] Conecta ao MongoDB

### Easypanel - Frontend Web:
- [ ] App criado
- [ ] Dockerfile configurado
- [ ] Environment variables configuradas
- [ ] Build com sucesso
- [ ] Deploy rodando
- [ ] Acessa backend corretamente

### Easypanel - Frontend Admin:
- [ ] App criado
- [ ] Dockerfile configurado
- [ ] Environment variables configuradas
- [ ] Build com sucesso
- [ ] Deploy rodando
- [ ] Acessa backend corretamente

### Domínios (Opcional):
- [ ] DNS configurado
- [ ] SSL ativo
- [ ] CORS configurado

---

## 🎯 Comandos Rápidos Git

### Atualizar código no GitHub:

```bash
cd C:\Users\Thiago\Desktop\marketplace

# Ver mudanças
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push

# Easypanel vai detectar e fazer redeploy automático!
```

---

## 📝 Resumo

1. **GitHub:**
   - Criar repositório
   - `git remote add origin URL`
   - `git push -u origin master`

2. **Easypanel - MongoDB:**
   - Criar MongoDB 7.0
   - Nome: `mercadogamer-mongodb`

3. **Easypanel - Backend:**
   - Build path: `MercadoGamer-Backend-main/MercadoGamer-Backend-main/api`
   - Dockerfile: `Dockerfile`
   - Env vars: DATABASE_HOST, MP_ACCESS_TOKEN, etc
   - Portas: 3000, 10111

4. **Easypanel - Frontends:**
   - Build path: `MercadoGamer`
   - Dockerfiles: `Dockerfile.web`, `Dockerfile.admin`
   - Env vars: NEXT_PUBLIC_SERVER_URL, etc
   - Portas: 3000 (web), 4300 (admin)

---

**Pronto! Seu MercadoGamer rodando em produção no Easypanel! 🚀**

**Dúvidas?** Consulte os logs no Easypanel ou verifique este guia novamente.
