# 🔒 Corrigir Vulnerabilidades - MercadoGamer

## ✅ Progresso Atual

**Antes:** 83 vulnerabilidades
**Depois:** 43 vulnerabilidades
**Redução:** 48% ✅

---

## 📊 Status das Vulnerabilidades

### Restantes (43):
- 4 low (baixa)
- 11 moderate (moderada)
- 21 high (alta)
- 7 critical (crítica)

---

## 🎯 Vulnerabilidades Principais

### 1. ❌ Socket.IO (CRÍTICA)

**Pacote:** `xmlhttprequest-ssl` e `ws`
**Versão Atual:** Socket.IO 2.3.0
**Problema:** Arbitrary Code Injection + DoS

**Solução:**
```bash
# Atualizar Socket.IO 2.3 → 4.x
npm install socket.io@4
```

**⚠️ ATENÇÃO:** Requer mudanças no código!
- Cliente e servidor precisam ser atualizados juntos
- API mudou entre v2 e v4

---

### 2. ⚠️ Sharp (ALTA)

**Pacote:** `sharp`
**Versão Atual:** < 0.32.6
**Problema:** CVE-2023-4863 (libwebp)

**Solução:**
```bash
npm install sharp@latest
```

**Impacto:** Baixo (API compatível)

---

### 3. ⚠️ MercadoPago (MODERADA)

**Pacote:** `tough-cookie`
**Problema:** Prototype Pollution

**Solução:**
```bash
npm install mercadopago@latest
```

**⚠️ ATENÇÃO:** Verificar se API mudou!

---

### 4. ⚠️ jsonwebtoken (ALTA)

**Problema:** Vulnerabilidade em dependências

**Solução:**
```bash
npm install jsonwebtoken@latest
```

---

## 🚀 Plano de Correção

### Nível 1: Seguro (Sem Breaking Changes)

```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api

# Atualizar sharp
npm install sharp@latest

# Atualizar jsonwebtoken
npm install jsonwebtoken@latest

# Testar se funciona
npx babel-node index.js
```

**Risco:** 🟢 Baixo

---

### Nível 2: Moderado (Verificar API)

```bash
# Atualizar MercadoPago
npm install mercadopago@latest

# Verificar documentação:
# https://www.mercadopago.com.br/developers/pt/docs/

# Testar pagamentos
```

**Risco:** 🟡 Médio
**Ação:** Testar integração de pagamentos

---

### Nível 3: Alto (Requer Mudanças no Código)

#### Socket.IO 2.3 → 4.x

**Mudanças Necessárias:**

**Backend (api/app.js):**
```javascript
// ANTES (Socket.IO 2.x)
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.emit('message', data);
});

// DEPOIS (Socket.IO 4.x) - Mudanças mínimas
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // Configurar CORS
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.emit('message', data);
});
```

**Frontend (Next.js):**
```javascript
// ANTES
import io from 'socket.io-client';
const socket = io('http://localhost:10111');

// DEPOIS (Socket.IO 4.x) - Compatível!
import { io } from 'socket.io-client';
const socket = io('http://localhost:10111');
```

**Comando:**
```bash
# Backend
npm install socket.io@4

# Frontend
cd MercadoGamer
npm install socket.io-client@4
```

**Risco:** 🔴 Alto
**Esforço:** 2-4 horas (testes inclusos)

---

## 📝 Roteiro Completo

### Fase 1: Correções Simples (30 min)

```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api

# 1. Atualizar Sharp
npm install sharp@latest

# 2. Atualizar jsonwebtoken
npm install jsonwebtoken@latest

# 3. Atualizar bcrypt
npm install bcrypt@latest

# 4. Testar
npx babel-node index.js
# Verificar se carrega sem erros
```

**Resultado Esperado:** ~20 vulnerabilidades corrigidas

---

### Fase 2: MercadoPago (1 hora)

```bash
# 1. Backup do código atual
git commit -am "Backup antes atualizar MercadoPago"

# 2. Atualizar
npm install mercadopago@latest

# 3. Verificar mudanças na API
# https://github.com/mercadopago/sdk-nodejs

# 4. Testar criação de pagamento
# - Criar produto
# - Fazer checkout
# - Verificar se gera preferência
# - Verificar webhook
```

---

### Fase 3: Socket.IO (4 horas)

```bash
# 1. Backup completo
git commit -am "Backup antes atualizar Socket.IO"

# 2. Atualizar backend
cd api
npm install socket.io@4

# 3. Atualizar frontend
cd ../MercadoGamer
npm install socket.io-client@4

# 4. Atualizar código
# Ver exemplos acima

# 5. Testar:
# - Chat entre usuários
# - Notificações real-time
# - Conexão/desconexão
```

---

## ⚡ Correção Rápida (Recomendado)

Se você quer corrigir **AGORA sem quebrar nada:**

```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api

# Atualizar apenas pacotes seguros
npm install sharp@latest bcrypt@latest jsonwebtoken@latest axios@latest

# Verificar
npm audit

# Testar
npx babel-node index.js
```

**Resultado:** ~15-20 vulnerabilidades corrigidas
**Tempo:** 10 minutos
**Risco:** 🟢 Muito baixo

---

## 🛡️ Correção Completa (Para Produção)

```bash
# 1. Fazer backup
git commit -am "Backup antes correções segurança"

# 2. Atualizar tudo exceto Socket.IO
npm install sharp@latest bcrypt@latest jsonwebtoken@latest \
             axios@latest mercadopago@latest nodemailer@latest

# 3. Testar TUDO
npx babel-node index.js
# Testar:
# - Login
# - Criar produto
# - Upload imagem
# - Pagamento
# - Email

# 4. Socket.IO (separado)
npm install socket.io@4
# Atualizar código
# Testar chat
```

---

## 📊 Tabela de Prioridades

| Pacote | Versão Atual | Versão Nova | Risco | Prioridade |
|--------|--------------|-------------|-------|------------|
| **sharp** | <0.32.6 | 0.34.4 | 🟢 Baixo | 🔴 Alta |
| **jsonwebtoken** | 8.3.0 | 9.x | 🟢 Baixo | 🔴 Alta |
| **bcrypt** | 5.0.1 | 5.1.x | 🟢 Baixo | 🟡 Média |
| **mercadopago** | 1.5.8 | 2.9.0 | 🟡 Médio | 🟡 Média |
| **socket.io** | 2.3.0 | 4.x | 🔴 Alto | 🔴 Alta* |

*Requer mudanças no código

---

## ✅ Comandos Prontos para Usar

### Opção A: Correção Segura (10 min)
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm install sharp@latest bcrypt@latest jsonwebtoken@latest
npx babel-node index.js  # Testar
```

### Opção B: Correção Moderada (30 min)
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm install sharp@latest bcrypt@latest jsonwebtoken@latest mercadopago@latest
npx babel-node index.js  # Testar
# Testar pagamentos MercadoPago
```

### Opção C: Correção Completa (4 horas)
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api

# Todas as atualizações
npm install sharp@latest bcrypt@latest jsonwebtoken@latest \
            mercadopago@latest socket.io@4

# Atualizar frontend
cd ../MercadoGamer
npm install socket.io-client@4

# Atualizar código Socket.IO (ver guia acima)
# Testar TUDO
```

---

## 🎯 Minha Recomendação

### Para AGORA (Desenvolvimento):

**Opção A - Correção Segura**
- ✅ Rápido (10 min)
- ✅ Zero risco
- ✅ Corrige ~15-20 vulnerabilidades
- ✅ Não quebra nada

```bash
cd api
npm install sharp@latest bcrypt@latest jsonwebtoken@latest
```

### Para DEPOIS (Antes de Produção):

**Opção C - Correção Completa**
- ⚠️ Demora mais (4h)
- ⚠️ Requer testes
- ✅ Corrige 80-90% das vulnerabilidades
- ✅ Deixa pronto para produção

---

## 📝 Checklist

- [ ] Fazer backup do código (`git commit`)
- [ ] Atualizar sharp
- [ ] Atualizar jsonwebtoken
- [ ] Atualizar bcrypt
- [ ] Testar backend (npx babel-node index.js)
- [ ] Atualizar mercadopago (opcional)
- [ ] Testar pagamentos (opcional)
- [ ] Atualizar Socket.IO (opcional - mais trabalhoso)
- [ ] Rodar npm audit novamente
- [ ] Documentar mudanças

---

## ❓ Dúvidas Comuns

**Q: Vai quebrar meu código?**
A: Opção A (segura) → Não. Opção C (completa) → Socket.IO sim, resto não.

**Q: Preciso fazer agora?**
A: Não é urgente se for só desenvolvimento. Para produção, SIM.

**Q: Todas as vulnerabilidades são perigosas?**
A: Não. Muitas são em dependências de desenvolvimento. As críticas (Sharp, Socket.IO) são mais importantes.

**Q: Docker ajuda?**
A: Sim! Docker isola o ambiente, mas ainda assim é bom corrigir.

---

**Quer que eu aplique a Opção A (segura) agora?** Demora 2 minutos e não quebra nada!
