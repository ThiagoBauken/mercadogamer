# 🎮 MercadoGamer - Instruções de Setup

## ✅ Status do Projeto

**Migração Concluída:** AWS → Docker ✓
**Banco de Dados:** MongoDB (mantido)
**Status:** Pronto para rodar!

---

## 🚀 Como Rodar em 3 Passos

### Passo 1: Configure o ambiente

```bash
# Copie o template de variáveis
cp .env.example .env
```

Abra o arquivo `.env` e preencha suas credenciais:

```env
# Mínimo necessário:
MP_ACCESS_TOKEN=seu_token_mercadopago_aqui
STRIPE_KEY=seu_token_stripe_aqui

# O resto já está configurado para Docker!
```

### Passo 2: Inicie o Docker

```bash
# Certifique-se de que o Docker está rodando
docker --version

# Inicie todos os serviços
docker-compose up -d
```

Isso vai iniciar:
- ✅ MongoDB (porta 27017)
- ✅ Backend API (porta 3000)
- ✅ Socket.IO (porta 10111)
- ✅ Frontend Web (porta 3001)
- ✅ Frontend Admin (porta 4300)
- ✅ MailHog (porta 8025)

### Passo 3: Acesse as aplicações

| Aplicação | URL | Login |
|-----------|-----|-------|
| **Marketplace** | http://localhost:3001 | - |
| **Admin Panel** | http://localhost:4300 | - |
| **API** | http://localhost:3000/api | - |
| **MailHog** (emails) | http://localhost:8025 | - |

---

## 📋 Comandos Úteis

```bash
# Ver logs em tempo real
npm run logs

# Ver logs de um serviço específico
npm run docker:logs:backend
npm run docker:logs:web
npm run docker:logs:admin

# Ver status dos containers
docker-compose ps

# Parar todos os serviços
npm stop
# ou
docker-compose down

# Reiniciar um serviço
docker-compose restart backend

# Reconstruir após mudanças no código
npm run docker:rebuild
```

---

## 🔍 Verificar se Está Funcionando

### 1. Verificar containers rodando:

```bash
docker-compose ps
```

Deve mostrar 5 containers rodando:
- mercadogamer-mongodb
- mercadogamer-backend
- mercadogamer-frontend-web
- mercadogamer-frontend-admin
- mercadogamer-mailhog

### 2. Verificar logs do backend:

```bash
npm run docker:logs:backend
```

Deve mostrar:
```
Connected to MongoDB successfully
server listening at env: 10111
```

### 3. Testar API:

Abra no navegador:
```
http://localhost:3000/api/health
```

### 4. Testar Frontend:

```
http://localhost:3001
```

---

## 🐛 Troubleshooting

### Problema: Porta já em uso

**Erro:**
```
Error: bind: address already in use
```

**Solução:**
Edite `docker-compose.yml` e mude a porta:
```yaml
frontend-web:
  ports:
    - "3002:3000"  # Mudou de 3001 para 3002
```

---

### Problema: MongoDB não conecta

**Sintoma:**
```
MongoServerError: connect ECONNREFUSED
```

**Solução:**
```bash
# Parar tudo
docker-compose down -v

# Iniciar novamente
docker-compose up -d

# Ver logs
npm run docker:logs:backend
```

---

### Problema: Frontend não carrega

**Solução:**
```bash
# Rebuild do frontend
docker-compose up -d --build frontend-web

# Ver logs
npm run docker:logs:web
```

---

### Problema: Mudanças no código não aparecem

**Solução:**

Os volumes estão configurados para hot-reload, mas se não funcionar:

```bash
# Rebuild completo
docker-compose down
docker-compose up -d --build
```

---

## 🗄️ Acessar MongoDB

### Via Docker:

```bash
# Acessar shell do MongoDB
docker-compose exec mongodb mongosh mercadogamer

# Listar coleções
show collections

# Ver usuários
db.users.find().pretty()

# Sair
exit
```

### Via Compass (GUI):

1. Baixe [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Conecte em: `mongodb://localhost:27017/mercadogamer`

---

## 📧 Testar Emails (MailHog)

Durante o desenvolvimento, todos os emails vão para o MailHog:

1. Acesse: http://localhost:8025
2. Faça alguma ação que envie email (recuperar senha, etc)
3. O email aparecerá no MailHog

**Produção:** Configure SMTP real no `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

---

## 🔐 Segurança

### ✅ O que foi corrigido:

- ❌ Credenciais AWS removidas
- ❌ Certificados SSL removidos do Git
- ✅ `.gitignore` robusto criado
- ✅ `.env` não vai mais para o Git
- ✅ `.env.example` com template seguro

### ⚠️ IMPORTANTE:

**NUNCA commite o arquivo `.env` no Git!**

```bash
# Verificar antes de commit:
git status

# Se .env aparecer, adicione ao .gitignore:
echo ".env" >> .gitignore
```

---

## 📊 Estrutura do Projeto

```
marketplace/
├── docker-compose.yml              # Orquestração Docker
├── .env                            # Suas credenciais (NÃO COMMITAR!)
├── .env.example                    # Template
├── package.json                    # Scripts npm
│
├── MercadoGamer/                   # Frontend (Next.js)
│   ├── apps/web/                   # Marketplace
│   ├── apps/admin/                 # Admin panel
│   ├── Dockerfile.web
│   └── Dockerfile.admin
│
└── MercadoGamer-Backend-main/      # Backend (Express.js)
    └── .../api/
        ├── modules/                # 31 módulos de negócio
        ├── config/                 # Configurações
        └── Dockerfile
```

---

## 🎯 Próximos Passos

### Desenvolvimento:

1. ✅ Configure suas credenciais no `.env`
2. ✅ Inicie o Docker (`npm start`)
3. ✅ Teste as funcionalidades principais
4. 🔄 Comece a desenvolver suas features!

### Opcional (melhorias):

- [ ] Atualizar Mongoose 5.5 → 7.x
- [ ] Atualizar Socket.IO 2.3 → 4.x
- [ ] Remover pastas Angular antigas (adm/, web/)
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD

---

## 🆘 Precisa de Ajuda?

### Comandos de diagnóstico:

```bash
# Ver tudo que está rodando
docker ps -a

# Ver uso de recursos
docker stats

# Ver logs completos de um serviço
docker logs mercadogamer-backend --tail 100 -f

# Limpar tudo (CUIDADO: apaga dados!)
docker-compose down -v
docker system prune -a
```

### Problemas persistentes?

1. Pare tudo: `docker-compose down -v`
2. Limpe: `docker system prune -a`
3. Inicie novamente: `docker-compose up -d --build`
4. Veja os logs: `npm run logs`

---

## ✨ Recursos Adicionais

- [README.md](README.md) - Documentação completa
- [QUICK_START.md](QUICK_START.md) - Início rápido
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Resumo da migração

---

**Pronto! Seu ambiente está 100% Dockerizado! 🎉**

Qualquer dúvida, consulte os logs ou a documentação.
