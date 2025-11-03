# ⚡ Comandos Rápidos - MercadoGamer

## 🐳 Docker (Forma Mais Fácil)

```bash
# INICIAR TUDO
docker-compose up -d

# VER LOGS
docker-compose logs -f

# PARAR TUDO
docker-compose down

# REBUILD
docker-compose up -d --build

# LIMPAR TUDO (CUIDADO!)
docker-compose down -v
```

---

## 💻 Local (Sem Docker)

### Backend
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm install
npm run local
```

### Frontend Web
```bash
cd MercadoGamer
npm install
npx nx serve web
```

### Frontend Admin
```bash
cd MercadoGamer
npx nx serve admin
```

---

## 🔍 Verificação

```bash
# Backend funcionando?
curl http://localhost:3000/api/health

# Ver processos Docker
docker-compose ps

# Ver logs de um serviço
docker-compose logs -f backend
docker-compose logs -f frontend-web
docker-compose logs -f frontend-admin

# Acessar MongoDB
docker-compose exec mongodb mongosh mercadogamer
```

---

## 🌐 URLs

| Serviço | URL |
|---------|-----|
| Web | http://localhost:3001 |
| Admin | http://localhost:4300 |
| API | http://localhost:3000 |
| MailHog | http://localhost:8025 |

---

## 🛠️ Desenvolvimento

```bash
# Instalar dependência no backend
cd api
npm install nome-pacote

# Instalar dependência no frontend
cd MercadoGamer
npm install nome-pacote

# Rebuild após mudanças
docker-compose restart backend
docker-compose restart frontend-web
```

---

## 🐛 Problemas Comuns

### Porta em uso
```bash
# Ver o que está usando a porta
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Linux/Mac

# Mudar porta no docker-compose.yml
```

### MongoDB não conecta
```bash
docker-compose down -v
docker-compose up -d
```

### Código não atualiza
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🗑️ Limpeza

```bash
# Limpar containers parados
docker container prune

# Limpar imagens não usadas
docker image prune

# Limpar volumes (CUIDADO: apaga dados!)
docker volume prune

# Limpar TUDO
docker system prune -a --volumes
```

---

## 📦 Build Produção

```bash
# Backend
cd api
npm ci --only=production
NODE_ENV=production npm start

# Frontend Web
cd MercadoGamer
npx nx build web --prod

# Frontend Admin
npx nx build admin --prod
```

---

**Salve este arquivo para consulta rápida!** 📌
