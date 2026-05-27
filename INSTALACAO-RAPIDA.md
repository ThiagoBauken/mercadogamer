# ⚡ INSTALAÇÃO RÁPIDA - Correções MercadoGamer

**Execute estes comandos para aplicar todas as correções:**

---

## 🔧 BACKEND

```bash
# 1. Navegar para pasta do backend
cd "c:\Users\Thiago\Desktop\marketplace\MercadoGamer-Backend-main\MercadoGamer-Backend-main\api"

# 2. Remover instalação antiga
rm -rf node_modules package-lock.json

# 3. Instalar dependências corretas
npm install

# 4. Verificar versões críticas
npm list bcrypt mongoose socket.io

# Deve mostrar:
# ├── bcrypt@5.1.1
# ├── mongoose@5.13.23
# └── socket.io@2.3.0

# 5. Configurar ambiente (se ainda não existe)
cp .env.example .env

# 6. Editar .env (mínimo necessário)
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost:27017
DATABASE_NAME=mercadogamer
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
EOF

# 7. Testar backend
npm run local

# Aguardar aparecer:
# ✅ MongoDB connected successfully!
# 🚀 Server listening on 0.0.0.0:3000
```

---

## 🎨 FRONTEND

```bash
# 1. Navegar para pasta do frontend
cd "c:\Users\Thiago\Desktop\marketplace\MercadoGamer"

# 2. Remover instalação antiga
rm -rf node_modules package-lock.json

# 3. Instalar dependências corretas
npm install

# 4. Verificar socket.io-client
npm list socket.io-client

# Deve mostrar:
# └── socket.io-client@2.4.0

# 5. Build para verificar erros
npm run build:web

# 6. Iniciar frontend
npm run web

# Abrir: http://localhost:3000
```

---

## ✅ VERIFICAÇÃO RÁPIDA

### Backend (Terminal 1):
```bash
# Health Check
curl http://localhost:3000/api/health

# Deve retornar:
# {"status":"ok","mongodb":"connected"}
```

### Frontend (Terminal 2):
```bash
# Verificar compilação
npm run build:web

# Sem erros = ✅ OK
```

### Browser:
1. Abrir http://localhost:3000
2. Abrir DevTools → Console
3. **NÃO deve ter:**
   - ❌ Erros de Socket.io connection
   - ❌ Erros de CORS
   - ❌ Erros 403/429

---

## 🐛 TROUBLESHOOTING

### Erro: "useCreateIndex is not supported"
```bash
# Já corrigido no código
# Se ainda aparece:
cd api
npm install mongoose@5.13.23 --save
```

### Erro: Socket.io não conecta
```bash
# Frontend
cd MercadoGamer
npm uninstall socket.io-client
npm install socket.io-client@^2.4.0
rm -rf node_modules package-lock.json
npm install
```

### Erro: bcrypt compilation failed
```bash
# Opção 1: Recompilar
cd api
npm rebuild bcrypt

# Opção 2: Usar bcryptjs (JavaScript puro)
npm uninstall bcrypt
npm install bcryptjs@2.4.3
# Editar app.js linha 116: require('bcryptjs')
```

### Erro: CORS blocked
```bash
# Adicionar origem ao .env do backend
echo "ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000" >> api/.env

# Reiniciar backend
```

---

## 📦 COMANDOS WINDOWS

Se estiver no Windows (cmd/PowerShell):

### Backend:
```powershell
cd "C:\Users\Thiago\Desktop\marketplace\MercadoGamer-Backend-main\MercadoGamer-Backend-main\api"
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

### Frontend:
```powershell
cd "C:\Users\Thiago\Desktop\marketplace\MercadoGamer"
rmdir /s /q node_modules
del package-lock.json
npm install
npm run web
```

---

## 🚀 DEPLOY (Produção)

Após testar localmente:

```bash
# 1. Commit das mudanças
git add .
git commit -m "fix: Corrige incompatibilidades de dependências

- Socket.io downgrade para compatibilidade (v2.4.0)
- Remove useCreateIndex deprecado do Mongoose
- Corrige versão do bcrypt para 5.1.1
- Ajusta rate limiting (500 req/15min)
- Desabilita Helmet CSP para permitir recursos externos
- Atualiza configurações CORS e .env.example"

# 2. Push
git push origin main

# 3. No servidor/Easypanel:
# - Rebuild containers
# - Configurar variáveis:
#   NODE_ENV=production
#   ALLOWED_ORIGINS=https://seudominio.com
#   DATABASE_HOST=seu-mongodb-host
#   MONGO_USER=usuario
#   MONGO_PASSWORD=senha

# 4. Verificar logs após deploy
# Deve mostrar:
# ✅ MongoDB connected successfully!
# 🚀 Server listening...
```

---

## 📋 CHECKLIST FINAL

### Antes de considerar pronto:
- [ ] Backend instala sem erros
- [ ] Frontend instala sem erros
- [ ] Bcrypt versão 5.1.1
- [ ] Socket.io-client versão 2.4.0
- [ ] Backend inicia e conecta MongoDB
- [ ] Frontend compila (build)
- [ ] Health check responde OK
- [ ] Login funciona
- [ ] Chat envia/recebe mensagens
- [ ] Sem erros no console do browser
- [ ] WebSocket conectado (Network tab)

---

## 🎯 RESULTADO ESPERADO

**Backend rodando:**
```
🔧 Starting MercadoGamer Backend...
📦 Node version: v18.x.x
🌍 NODE_ENV: development
✅ MongoDB connected successfully!
✅ Security middlewares loaded successfully
🚀 Server (HTTP + Socket.IO) listening on 0.0.0.0:3000
📡 API: http://localhost:3000/api
🔌 WebSocket: ws://localhost:3000
```

**Frontend rodando:**
```
ready - started server on 0.0.0.0:3000
info  - Loaded env from .env.local
event - compiled successfully
```

**Browser Console:**
```
✅ Socket.io connected
✅ User authenticated
✅ Ready to receive notifications
```

---

**Tempo estimado:** 5-10 minutos
**Última atualização:** 20/11/2025
