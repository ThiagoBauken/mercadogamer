# 🔴 DIAGNÓSTICO COMPLETO - Problema de Loop no Backend

## ❌ PROBLEMAS CRÍTICOS IDENTIFICADOS:

### 1. **Volume Mount causando restarts infinitos**
**Arquivo:** `docker-compose.yml:51-54`
**Problema:**
```yaml
volumes:
  - ./MercadoGamer-Backend-main/MercadoGamer-Backend-main/api:/app
  - /app/node_modules
```
- O volume mount sincroniza TODOS os arquivos do host com o container
- Qualquer mudança local (mesmo fora do container) aciona o nodemon
- Arquivos criados pelo próprio backend (CSV, logs) reiniciam o servidor

**Impacto:** 🔥 CRÍTICO - Causa loop infinito de restarts

---

### 2. **Nodemon assistindo arquivos demais**
**Arquivo:** `nodemon.json:3-4` (ANTES)
**Problema:**
```json
"watch": ["**/*.js"]
```
- Assiste TODOS os arquivos .js em TODOS os subdiretórios
- Inclui node_modules, scripts, arquivos temporários
- Delay de apenas 1 segundo (muito curto)

**Impacto:** 🔥 CRÍTICO - Restarts desnecessários

---

### 3. **Dois processos rodando simultaneamente no Easypanel**
**Evidência dos logs:**
```
> MercadoGamer@0.0.1 local      ← Development mode (nodemon)
> MercadoGamer@0.0.1 start      ← Production mode (babel-node)
```

**Causas possíveis:**
- Dockerfile com CMD incorreto
- Easypanel executando múltiplos comandos
- Variável NODE_ENV não configurada corretamente

**Impacto:** 🟡 MÉDIO - Desperdício de recursos, logs confusos

---

### 4. **Dockerfiles inconsistentes**
**Arquivos:**
- `Dockerfile` (raiz): CMD condicional ✅
- `MercadoGamer-Backend-main/.../Dockerfile`: CMD fixo "local" ❌

**Problema:** Docker-compose usa o Dockerfile da subpasta que sempre roda development mode

**Impacto:** 🟡 MÉDIO - Comportamento inconsistente

---

## ✅ SOLUÇÕES IMPLEMENTADAS:

### Solução 1: Desabilitar Volume Mount
**Arquivo:** `docker-compose.yml`
```yaml
volumes:
  # Volume mount DESABILITADO - evita loop do nodemon
  # - ./MercadoGamer-Backend-main/MercadoGamer-Backend-main/api:/app
  # - /app/node_modules
  - uploads:/app/files
  - uploads:/app/uploads
```

**Resultado:**
- ✅ Elimina causa principal do loop
- ⚠️ Requer rebuild para ver mudanças de código
- ✅ Comportamento igual ao Easypanel/produção

---

### Solução 2: Nodemon mais restritivo
**Arquivo:** `nodemon.json`
```json
{
  "watch": [
    "index.js",
    "app.js",
    "routes/**/*.js",
    "modules/**/*.js",
    "helpers/**/*.js",
    "config/**/*.js",
    "utils/**/*.js"
  ],
  "ignore": [
    "node_modules/**",
    "files/**",
    "uploads/**",
    "tmp/**",
    "**/*.csv",
    "**/*.json",
    "scripts/**"
  ],
  "delay": "2000"
}
```

**Resultado:**
- ✅ Assiste apenas diretórios necessários
- ✅ Ignora arquivos gerados dinamicamente (CSV, JSON)
- ✅ Delay aumentado para 2 segundos

---

### Solução 3: CMD condicional no Dockerfile
**Arquivo:** `MercadoGamer-Backend-main/.../Dockerfile`
```dockerfile
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start; else npm run local; fi"]
```

**Resultado:**
- ✅ Usa `npm run start` (sem nodemon) em produção
- ✅ Usa `npm run local` (com nodemon) em desenvolvimento
- ✅ Controlado pela variável NODE_ENV

---

### Solução 4: Logging detalhado
**Arquivos:** `app.js`, `routes/health.js`
```javascript
// Log de TODAS as requisições HTTP
app.use((req, res, next) => {
  console.log(`📥 [${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  res.on('finish', () => {
    console.log(`📤 [${timestamp}] ${req.method} ${req.path} - Status: ${res.statusCode}`);
  });
  next();
});
```

**Resultado:**
- ✅ Identifica se requisições estão chegando
- ✅ Debug de problemas de roteamento (503 no Easypanel)
- ✅ Verifica health check

---

## 🚀 COMO TESTAR AS CORREÇÕES:

### Teste Local (Docker Compose):
```bash
# 1. Rebuild do backend
docker-compose build backend

# 2. Reiniciar apenas o backend
docker-compose up backend

# 3. Verificar logs
docker-compose logs -f backend
```

**Comportamento esperado:**
- Servidor inicia UMA vez
- Não reinicia automaticamente
- Logs mostram "✅ MongoDB connected successfully!"
- Logs mostram "🚀 Server listening on 0.0.0.0:3000"

---

### Teste no Easypanel:

**1. Configurar variável NODE_ENV:**
```
NODE_ENV=production
```

**2. Fazer rebuild do container**
- Git push das mudanças
- Rebuild no Easypanel

**3. Verificar logs:**
```
> MercadoGamer@0.0.1 start     ← Deve aparecer apenas esta linha
> NODE_ENV=production babel-node index.js
```

**NÃO deve aparecer:**
- ❌ `nodemon`
- ❌ Duas instâncias rodando
- ❌ Reinicializações automáticas

**4. Testar health check:**
```bash
curl -v http://localhost:3000/api/health
```

**Logs esperados:**
```
✅ Health check endpoint called - IP: 172.17.0.1
📊 Health status: {"status":"ok","mongodb":"connected"}
```

---

## 📋 CHECKLIST:

### Correções Locais:
- [x] Nodemon.json atualizado (watch específico)
- [x] Docker-compose.yml (volume mount desabilitado)
- [x] Dockerfile da subpasta (CMD condicional)
- [x] Logging de requisições HTTP adicionado
- [x] Health endpoint melhorado

### Próximos Passos:
- [ ] Commit e push das mudanças
- [ ] Rebuild no Easypanel
- [ ] Configurar NODE_ENV=production no Easypanel
- [ ] Verificar logs (apenas um processo)
- [ ] Testar health check endpoint
- [ ] Verificar se 503 foi resolvido

---

## 🔍 DEBUG NO EASYPANEL:

**Se ainda houver 503 após as correções:**

1. **Verificar se requisições chegam:**
```bash
curl http://localhost:3000/api/health
```
- Se aparecer nos logs = Backend OK, problema no Easypanel routing
- Se NÃO aparecer = Backend não está escutando corretamente

2. **Verificar porta exposta:**
```bash
netstat -tuln | grep 3000
```
Deve mostrar: `0.0.0.0:3000`

3. **Verificar configuração Easypanel:**
- Port Mapping: 3000 → 80/443
- Domain configurado corretamente
- Health Check path: `/api/health`

---

## 📊 COMPARAÇÃO:

### ANTES (com problemas):
```
🔴 Volume mount sincronizando tudo
🔴 Nodemon assistindo **/*.js
🔴 Dois processos rodando
🔴 Loop infinito de restarts
🔴 503 Service Unavailable
```

### DEPOIS (com correções):
```
✅ Sem volume mount (apenas uploads)
✅ Nodemon restrito a diretórios essenciais
✅ Um processo apenas (condicional por NODE_ENV)
✅ Servidor estável, sem restarts
✅ Logs detalhados para debug
```

---

**Última atualização:** 2025-11-04
**Status:** ✅ Correções implementadas, aguardando teste
