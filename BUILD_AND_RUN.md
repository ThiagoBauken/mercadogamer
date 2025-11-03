# 🏗️ Como Rodar e Fazer Build do MercadoGamer

## 📋 Índice

1. [Opção 1: Docker (Recomendado)](#opção-1-docker-recomendado)
2. [Opção 2: Desenvolvimento Local (Sem Docker)](#opção-2-desenvolvimento-local-sem-docker)
3. [Build para Produção](#build-para-produção)
4. [Troubleshooting](#troubleshooting)

---

## Opção 1: Docker (Recomendado) 🐳

### ✅ Mais fácil e rápido!

### Pré-requisitos:
- Docker instalado
- Docker Compose instalado

### Passos:

#### 1. Configure o .env
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

#### 2. Inicie tudo de uma vez
```bash
docker-compose up -d
```

**Pronto!** Todos os serviços estarão rodando:
- ✅ MongoDB → `localhost:27017`
- ✅ Backend API → `localhost:3000`
- ✅ Socket.IO → `localhost:10111`
- ✅ Frontend Web → `localhost:3001`
- ✅ Frontend Admin → `localhost:4300`
- ✅ MailHog → `localhost:8025`

#### 3. Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend web
docker-compose logs -f frontend-web
```

#### 4. Parar tudo
```bash
docker-compose down
```

---

## Opção 2: Desenvolvimento Local (Sem Docker) 💻

### Se você preferir rodar sem Docker:

### Pré-requisitos:
- Node.js 18+
- MongoDB rodando localmente (porta 27017)
- npm ou yarn

---

### 🔧 Backend (API Express.js)

#### 1. Navegue até a pasta do backend
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure o .env
```bash
# Crie o arquivo .env
cat > .env << EOF
DATABASE_HOST=localhost:27017
DATABASE_NAME=mercadogamer
SOCKET_PORT_SOI=10111
BASE_URL=http://localhost:3000
SMTP_HOST=localhost
SMTP_PORT=1025
EOF
```

#### 4. Inicie o backend
```bash
# Desenvolvimento (com auto-reload)
npm run local

# Produção (Windows)
npm run startwin

# Produção (Linux/Mac)
npm run start
```

**Backend rodando em:**
- HTTP API: `http://localhost:3000`
- Socket.IO: `http://localhost:10111`

---

### 🎨 Frontend Web (Marketplace)

#### 1. Navegue até a pasta do frontend
```bash
cd MercadoGamer
```

#### 2. Instale as dependências (se ainda não fez)
```bash
npm install
```

#### 3. Configure o .env.local
```bash
# Criar arquivo .env.local
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_SERVER_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:10111
NEXT_PUBLIC_FILE_URL=http://localhost:3000/files
NEXT_PUBLIC_DOMAIN=http://localhost:3001
EOF
```

#### 4. Rodar em desenvolvimento
```bash
# Via Nx
npx nx serve web

# Ou diretamente
cd apps/web
npm run dev
```

**Frontend Web rodando em:** `http://localhost:3000` (porta padrão Next.js)

---

### 👨‍💼 Frontend Admin (Painel)

#### 1. Na pasta MercadoGamer (mesma do web)

#### 2. Configure o .env.local
```bash
cat > apps/admin/.env.local << EOF
NEXT_PUBLIC_SERVER_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:10111
NEXT_PUBLIC_FILE_URL=http://localhost:3000/files
EOF
```

#### 3. Rodar em desenvolvimento
```bash
# Via Nx (já define porta 4300)
npx nx serve admin

# Ou diretamente com porta customizada
cd apps/admin
npm run dev -- -p 4300
```

**Frontend Admin rodando em:** `http://localhost:4300`

---

## Build para Produção 🚀

### Backend (Produção)

```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api

# Instalar apenas dependências de produção
npm ci --only=production

# Rodar
NODE_ENV=production npm start
```

---

### Frontend Web (Build Produção)

```bash
cd MercadoGamer

# Build via Nx
npx nx build web --configuration=production

# Arquivos de build estarão em:
# dist/apps/web

# Para servir o build:
cd dist/apps/web
npx next start
```

---

### Frontend Admin (Build Produção)

```bash
cd MercadoGamer

# Build via Nx
npx nx build admin --configuration=production

# Arquivos de build em:
# dist/apps/admin

# Para servir:
cd dist/apps/admin
npx next start -p 4300
```

---

## 📦 Comandos Nx Úteis

```bash
# Ver todos os projetos
npx nx show projects

# Rodar web em dev
npx nx serve web

# Rodar admin em dev
npx nx serve admin

# Build de produção
npx nx build web --prod
npx nx build admin --prod

# Rodar testes
npx nx test web
npx nx test admin

# Lint
npx nx lint web
npx nx lint admin

# Ver dependências do projeto
npx nx graph
```

---

## 🐛 Troubleshooting

### Problema: "npx: command not found"

**Solução:**
```bash
# Instalar npm globalmente
npm install -g npm

# Ou usar via node_modules
./node_modules/.bin/nx serve web
```

---

### Problema: Backend não conecta ao MongoDB

**Erro:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solução:**
```bash
# Certifique-se que MongoDB está rodando
# Windows (se instalado como serviço):
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod

# Ou via Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

---

### Problema: Frontend não encontra o backend

**Erro no console:**
```
Failed to fetch from http://localhost:3000/api
```

**Solução:**

1. Verifique se o backend está rodando:
```bash
curl http://localhost:3000/api/health
```

2. Verifique o arquivo `.env.local`:
```bash
cat apps/web/.env.local
# Deve ter:
NEXT_PUBLIC_SERVER_URL=http://localhost:3000/api
```

---

### Problema: Porta já em uso

**Erro:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**

1. Encontre o processo usando a porta:
```bash
# Windows:
netstat -ano | findstr :3000

# Linux/Mac:
lsof -i :3000
```

2. Mate o processo ou use outra porta:
```bash
# Usar porta diferente:
PORT=3001 npx nx serve web
```

---

### Problema: Módulos não encontrados

**Erro:**
```
Cannot find module '@nrwl/next'
```

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Ou
npm ci
```

---

## 🔄 Workflow Completo de Desenvolvimento

### Primeira vez:

```bash
# 1. Clone o repositório (já feito)
# 2. Configure ambiente
cp .env.example .env
# Edite o .env

# 3. Backend
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm install
npm run local &

# 4. Frontend Web
cd ../../../MercadoGamer
npm install
npx nx serve web &

# 5. Frontend Admin
npx nx serve admin &
```

### Dia a dia:

```bash
# Opção A: Usar Docker (mais fácil)
docker-compose up -d
docker-compose logs -f

# Opção B: Rodar localmente
# Terminal 1 - Backend
cd api && npm run local

# Terminal 2 - Web
cd MercadoGamer && npx nx serve web

# Terminal 3 - Admin
npx nx serve admin
```

---

## 📊 Resumo dos Comandos

### Com Docker (Recomendado):
```bash
docker-compose up -d        # Iniciar
docker-compose logs -f      # Ver logs
docker-compose down         # Parar
```

### Sem Docker:

**Backend:**
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm install
npm run local
```

**Frontend Web:**
```bash
cd MercadoGamer
npm install
npx nx serve web
```

**Frontend Admin:**
```bash
cd MercadoGamer
npx nx serve admin
```

---

## ✅ Checklist de Verificação

Antes de começar a desenvolver, verifique:

- [ ] MongoDB está rodando (porta 27017)
- [ ] Backend rodando sem erros (porta 3000)
- [ ] Socket.IO conectado (porta 10111)
- [ ] Frontend Web acessível (localhost:3000 ou 3001)
- [ ] Frontend Admin acessível (localhost:4300)
- [ ] MailHog capturando emails (localhost:8025) - se usando Docker
- [ ] Arquivo `.env` configurado com credenciais
- [ ] Arquivos `.env.local` nos frontends configurados

---

**Pronto! Agora você sabe rodar tudo corretamente! 🎉**

Use **Docker** para facilidade ou **local** para desenvolvimento mais rápido.
