# 🎮 MercadoGamer - Marketplace de Jogos

Plataforma completa de marketplace para compra e venda de jogos, contas e itens digitais.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js + React)          │
│  ├─ Web (Marketplace)    → :3001           │
│  └─ Admin (Painel)       → :4300           │
└───────────────┬─────────────────────────────┘
                │
┌───────────────▼─────────────────────────────┐
│      Backend (Express.js + Socket.IO)       │
│  ├─ API REST             → :3000           │
│  └─ WebSocket            → :10111          │
└───────────────┬─────────────────────────────┘
                │
┌───────────────▼─────────────────────────────┐
│          MongoDB Database → :27017          │
└─────────────────────────────────────────────┘
```

## 📦 Tecnologias

### Backend
- **Node.js 18** com Express.js
- **MongoDB 7.0** (Mongoose ODM)
- **Socket.IO 2.3** (real-time)
- **JWT** (autenticação)
- **Stripe + MercadoPago** (pagamentos)
- **Nodemailer** (emails)

### Frontend
- **Next.js 13** + React 18
- **TypeScript**
- **Nx Monorepo** (workspace management)
- **Socket.IO Client** (chat real-time)

## 🚀 Início Rápido com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### 1. Clone o repositório

```bash
cd marketplace
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e preencha suas credenciais
# (MercadoPago, Stripe, etc)
```

### 3. Inicie todos os serviços

```bash
docker-compose up -d
```

Isso irá iniciar:
- ✅ MongoDB (porta 27017)
- ✅ Backend API (porta 3000)
- ✅ Socket.IO Server (porta 10111)
- ✅ Frontend Web (porta 3001)
- ✅ Frontend Admin (porta 4300)
- ✅ MailHog - Email Test Server (porta 8025)

### 4. Acesse as aplicações

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend Web** | http://localhost:3001 | Marketplace público |
| **Frontend Admin** | http://localhost:4300 | Painel administrativo |
| **Backend API** | http://localhost:3000/api | API REST |
| **MailHog UI** | http://localhost:8025 | Interface de emails (desenvolvimento) |

## 📋 Comandos Úteis

### Gerenciar Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend-web

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga o banco!)
docker-compose down -v

# Reconstruir imagens após mudanças
docker-compose up -d --build

# Reiniciar um serviço específico
docker-compose restart backend
```

### Acesso ao container

```bash
# Acessar shell do backend
docker-compose exec backend sh

# Acessar MongoDB
docker-compose exec mongodb mongosh mercadogamer

# Ver processos rodando
docker-compose ps
```

## 🛠️ Desenvolvimento Local (sem Docker)

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

## 📁 Estrutura do Projeto

```
marketplace/
├── docker-compose.yml              # Orquestração Docker
├── .env.example                    # Template de variáveis
├── .gitignore                      # Arquivos ignorados
│
├── MercadoGamer/                   # Frontend (Nx Monorepo)
│   ├── apps/
│   │   ├── web/                    # Marketplace público (Next.js)
│   │   └── admin/                  # Painel admin (Next.js)
│   ├── libs/
│   │   └── ui-shared/              # Componentes compartilhados
│   ├── Dockerfile.web              # Build Web
│   └── Dockerfile.admin            # Build Admin
│
└── MercadoGamer-Backend-main/
    └── MercadoGamer-Backend-main/
        └── api/                    # Backend Express.js
            ├── config/             # Configurações
            ├── models/             # Models Mongoose
            ├── modules/            # Módulos de negócio (30+)
            ├── routes/             # Rotas API
            ├── helpers/            # Funções auxiliares
            ├── utils/              # Utilitários
            └── Dockerfile          # Build Backend
```

## 🔐 Segurança

### Credenciais Removidas

Este projeto foi limpo de credenciais AWS expostas. Agora usa:
- ✅ **MailHog** para emails em desenvolvimento
- ✅ **SMTP genérico** para produção (configurável)
- ✅ **SMS desativado** (opcional: Twilio)
- ✅ **Armazenamento local** via Docker volumes

### Arquivo .env

**NUNCA commite o arquivo .env no Git!**

Use sempre o `.env.example` como template e preencha com suas credenciais reais.

## 📧 Emails em Desenvolvimento

Usamos **MailHog** para capturar todos os emails enviados durante o desenvolvimento:

1. Acesse http://localhost:8025
2. Todos os emails enviados pela aplicação aparecerão aqui
3. Não precisa configurar SMTP real para testar

## 💰 Configurar Pagamentos

### MercadoPago

1. Acesse https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Copie o `Access Token` (test ou prod)
4. Adicione ao `.env`: `MP_ACCESS_TOKEN=seu_token_aqui`

### Stripe

1. Acesse https://dashboard.stripe.com/apikeys
2. Copie a `Secret Key`
3. Adicione ao `.env`: `STRIPE_KEY=seu_token_aqui`

## 🗄️ Banco de Dados

### Backup

```bash
# Criar backup
docker-compose exec mongodb mongodump --db mercadogamer --out /data/backup

# Copiar backup para host
docker cp mercadogamer-mongodb:/data/backup ./backup
```

### Restore

```bash
# Copiar backup para container
docker cp ./backup mercadogamer-mongodb:/data/backup

# Restaurar
docker-compose exec mongodb mongorestore --db mercadogamer /data/backup/mercadogamer
```

## 🐛 Troubleshooting

### Porta já em uso

Se alguma porta já estiver em uso, edite o `docker-compose.yml`:

```yaml
ports:
  - "3002:3000"  # Muda porta local para 3002
```

### Rebuild após mudanças

```bash
docker-compose down
docker-compose up -d --build
```

### Limpar tudo e recomeçar

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📝 TODO

- [ ] Remover pastas Angular legadas (adm/ e web/)
- [ ] Atualizar Mongoose para 7.x
- [ ] Atualizar Socket.IO para 4.x
- [ ] Migrar backend para TypeScript
- [ ] Consolidar em monorepo único
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD
- [ ] Documentar API REST (Swagger)

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT - veja [LICENSE](LICENSE) para mais detalhes.

## 🤝 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/seu-usuario/mercadogamer/issues)
- Email: suporte@mercadogamer.com

---

**Desenvolvido com ❤️ pela equipe MercadoGamer**
