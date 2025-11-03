# 🚀 Início Rápido - MercadoGamer

## ⚡ 3 Passos para Rodar

### 1. Configure o ambiente

```bash
# Copie o template de variáveis
npm run setup

# OU manualmente:
cp .env.example .env
```

Edite o `.env` e adicione suas credenciais (mínimo necessário para começar):
```env
MP_ACCESS_TOKEN=seu_token_mercadopago
STRIPE_KEY=seu_token_stripe
```

### 2. Inicie o Docker

```bash
npm start
# ou
docker-compose up -d
```

### 3. Acesse as aplicações

- **Web:** http://localhost:3001
- **Admin:** http://localhost:4300
- **API:** http://localhost:3000
- **Emails (MailHog):** http://localhost:8025

## ✅ Verificar se está funcionando

```bash
# Ver logs
npm run logs

# Ver status dos containers
npm run docker:ps

# Parar tudo
npm stop
```

## 📚 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia todos os serviços |
| `npm stop` | Para todos os serviços |
| `npm run logs` | Ver logs em tempo real |
| `npm run docker:rebuild` | Reconstruir após mudanças |
| `npm run docker:clean` | Limpar tudo (CUIDADO!) |

## 🔧 Troubleshooting

### Porta em uso?
Edite `docker-compose.yml` e mude a porta:
```yaml
ports:
  - "3002:3000"  # Muda 3001 para 3002
```

### Problemas com MongoDB?
```bash
# Limpar volumes e recomeçar
docker-compose down -v
docker-compose up -d
```

### Rebuild completo
```bash
docker-compose down
docker-compose up -d --build
```

## 📖 Documentação Completa

Veja [README.md](README.md) para documentação completa.

---

**Pronto para começar!** 🎮
