# 🚀 Configuração Easypanel - MercadoGamer

## 📦 Dockerfiles na Raiz (ATUALIZADO)

Os Dockerfiles foram movidos para a **raiz do projeto** para facilitar o deploy no Easypanel.

---

## 🔧 Backend API

### Configuração no Easypanel:

**Source:**
- Repository: `ThiagoBauken/mercadogamer`
- Branch: `main`

**Build:**
- **Build Path:** `.` (raiz)
- **Dockerfile:** `Dockerfile.backend`

**Ports:**
- 3000 (HTTP API)
- 10111 (Socket.IO)

**Environment Variables:**
```env
NODE_ENV=production
DATABASE_HOST=mercadogamer-mongodb:27017
DATABASE_NAME=mercadogamer
MONGO_USER=admin
MONGO_PASSWORD=MercadoGamer2024!
SOCKET_PORT_SOI=10111
MP_ACCESS_TOKEN=seu_token_mercadopago
STRIPE_KEY=seu_token_stripe
```

**Domain:**
```
https://private-mercadogamer.pbzgje.easypanel.host
```

---

## 🌐 Frontend Web (Marketplace)

### Configuração no Easypanel:

**Source:**
- Repository: `ThiagoBauken/mercadogamer`
- Branch: `main`

**Build:**
- **Build Path:** `.` (raiz)
- **Dockerfile:** `Dockerfile.web`

**Ports:**
- 3000

**Environment Variables:**
```env
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://private-mercadogamer.pbzgje.easypanel.host/api
NEXT_PUBLIC_SOCKET_URL=https://private-mercadogamer.pbzgje.easypanel.host
NEXT_PUBLIC_FILE_URL=https://private-mercadogamer.pbzgje.easypanel.host/files
NEXT_PUBLIC_DOMAIN=https://SEU-DOMINIO-WEB.easypanel.host
```

---

## 👨‍💼 Frontend Admin (Painel)

### Configuração no Easypanel:

**Source:**
- Repository: `ThiagoBauken/mercadogamer`
- Branch: `main`

**Build:**
- **Build Path:** `.` (raiz)
- **Dockerfile:** `Dockerfile.admin`

**Ports:**
- 4300

**Environment Variables:**
```env
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://private-mercadogamer.pbzgje.easypanel.host/api
NEXT_PUBLIC_SOCKET_URL=https://private-mercadogamer.pbzgje.easypanel.host
NEXT_PUBLIC_FILE_URL=https://private-mercadogamer.pbzgje.easypanel.host/files
```

---

## 📋 Ordem de Deploy

1. **MongoDB** (já criado ✅)
2. **Backend API** (use Dockerfile.backend)
3. **Frontend Web** (use Dockerfile.web)
4. **Frontend Admin** (use Dockerfile.admin)

---

## ✅ Checklist

- [x] Dockerfiles na raiz
- [x] MongoDB criado no Easypanel
- [ ] Backend API deployado
- [ ] Frontend Web deployado
- [ ] Frontend Admin deployado

---

## 🔄 Diferença dos Dockerfiles Antigos

**Antigo (NÃO USAR):**
- `MercadoGamer-Backend-main/MercadoGamer-Backend-main/api/Dockerfile`
- `MercadoGamer/Dockerfile.web`
- `MercadoGamer/Dockerfile.admin`

**Novo (USAR):**
- `Dockerfile.backend` (raiz)
- `Dockerfile.web` (raiz)
- `Dockerfile.admin` (raiz)

Os novos Dockerfiles copiam os arquivos das subpastas automaticamente!

---

**Pronto para deploy!** 🎉
