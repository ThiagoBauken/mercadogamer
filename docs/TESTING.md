# 🧪 Como testar o MercadoGamer

Receitas práticas pra validar o sistema localmente. Baseado nos smoke tests reais de 27/05/2026.

---

## 🟢 Pré-requisitos

- Node 22.x (`node --version` → `v22.x`)
- MongoDB rodando OU acesso ao Mongo remoto configurado em `.env`
- Backend deps instaladas (`npm install` em `api/`)
- Frontend deps instaladas (`npm install` em `MercadoGamer/`)
- Pastas criadas: `api/files/` e `api/uploads/`

---

## ✅ Smoke test (5 minutos)

### Passo 1 — Subir backend
```powershell
cd C:\Users\Thiago\Desktop\marketplace\MercadoGamer-Backend-main\MercadoGamer-Backend-main\api
npm run init-db    # primeira vez apenas
npm run local
```

Esperado: 31 modules carregam, MongoDB conecta, server escuta na :3000.

### Passo 2 — Health check
```bash
curl http://localhost:3000/api/health
```
Esperado: `{"status":"ok","mongodb":"connected"}`

### Passo 3 — Cadastro
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser01",
    "password":"Teste1234!",
    "emailAddress":"test01@mercadogamer.test",
    "phoneNumber":"+5511999999999",
    "name":"Teste",
    "lastName":"User",
    "country":"Brasil"
  }'
```
Esperado: HTTP 200, retorna user completo com `token` JWT.

### Passo 4 — Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser01","password":"Teste1234!"}'
```
Esperado: HTTP 200, retorna user + `token`.

### Passo 5 — Endpoint autenticado
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser01","password":"Teste1234!"}' \
  | grep -oE '"token":"[^"]+"' | sed 's/"token":"//;s/"$//')

curl http://localhost:3000/api/users -H "x-access-token: $TOKEN"
```
Esperado: HTTP 200, lista de usuários.

### Passo 6 — Upload de arquivo
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "x-access-token: $TOKEN" \
  -F "file=@/caminho/para/imagem.png"
```
Esperado: HTTP 200, retorna `{"data":{"file":"api_<uuid>.webp"}}`.

Arquivo deve aparecer em `api/files/`.

### Passo 7 — Socket.IO real-time
Crie `sio-test.js` dentro de `api/`:
```js
const { io } = require('socket.io-client');
const socket = io('http://localhost:3000', { transports: ['websocket'] });
socket.on('connect', () => {
  console.log('connected', socket.id);
  socket.emit('test-socket', socket.id);
});
socket.on('test-socket', (msg) => {
  console.log('echo:', msg);
  process.exit(0);
});
```
Rode: `node sio-test.js`. Esperado:
```
connected <sid>
echo: recibido desde la api
```

### Passo 8 — Subir frontend
```powershell
cd C:\Users\Thiago\Desktop\marketplace\MercadoGamer
npx nx serve web
```

Esperado: `Ready in <Xms>` na `:4200`. Abrir `http://localhost:4200` no browser deve mostrar HTML renderizado.

---

## 🔴 Testes que DEVEM falhar (esperado)

| Teste | Por quê | Como destravar |
|---|---|---|
| `POST /api/mp/initPoint` | Access token MercadoPago expirado/inválido | Trocar `MP_ACCESS_TOKEN` no `.env` por token novo do dashboard |
| `POST /api/stripe/create-payment-intent` | `STRIPE_TEST_SECRET_KEY` vazio no `.env` | Setar a key |
| `GET /api/users/sendSms` (envio real) | Twilio não configurado, está mockado | Setar `TWILIO_*` no `.env` |
| `GET /api/orders/buyer` ou `/seller` | Endpoint não existe | Use `/api/orders` (sem subpath) |

---

## 🔍 Onde olhar quando algo quebra

| Sintoma | Local de debug |
|---|---|
| Backend não sobe | stderr do `npm run local` — procure por `Error:` |
| MongoDB não conecta | `.env` — `DATABASE_HOST`, `MONGO_USER`, `MONGO_PASSWORD` |
| Cadastro retorna "Ocurrio un error" | Provavelmente país não existe — rode `npm run init-db` |
| Upload retorna "No se pudo guardar" | Pasta `api/files/` ou `api/uploads/` não existe |
| Login retorna "Falta parametro" | Envie `{username, password}`, NÃO `{emailOrUsername, password}` |
| Rota autenticada retorna "No se encuentra token" | Use header `x-access-token`, NÃO `Authorization: Bearer` |
| Frontend `getCompilationError undefined` | Cache do Next sujo — `rm -rf .next` e re-subir |
| Sharp toFile fails | Diretório destino não existe (`api/files/`) |

---

## 📋 Checklist antes de qualquer release

- [ ] `npm run init-db` rodou ao menos uma vez
- [ ] `npm run local` sobe sem erros vermelhos
- [ ] `GET /api/health` retorna 200
- [ ] Login com `vendedor1` / `vendedor123` funciona
- [ ] `npx nx serve web` sobe e `localhost:4200` renderiza
- [ ] `npx nx serve admin` sobe (testar pelo menos uma vez)
- [ ] Upload de arquivo grava em `api/files/`
- [ ] Socket.IO client v4 conecta e ecoa
- [ ] `.env` sem placeholders críticos (DATABASE_HOST, JWT_SECRET)
- [ ] Working tree do git limpo (`git status`)

---

## 🛠️ Comandos úteis

```bash
# Listar versões instaladas
cd api && npm list mongoose socket.io express bcryptjs multer mercadopago stripe
cd MercadoGamer && npm list nx next socket.io-client

# Validar sintaxe sem rodar (após mudança)
cd api && node --check app.js && node --check index.js

# Ver últimos logs do backend (Windows com Start-Process)
tail -50 /tmp/be.log 2>&1
tail -30 /tmp/be.err 2>&1

# Reset completo de deps
rm -rf node_modules package-lock.json && npm install --no-audit --no-fund

# Verificar processos rodando na porta
netstat -ano | findstr :3000
netstat -ano | findstr :4200
```
