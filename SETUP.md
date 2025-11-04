# 🚀 Guia de Configuração - MercadoGamer

Este guia contém instruções detalhadas para configurar o projeto MercadoGamer corretamente.

## ⚙️ Configuração de Ambiente do Frontend

O arquivo `environment.ts` é necessário para desenvolvimento local mas está no `.gitignore` para evitar commit de configurações locais.

### Frontend Web

```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/web

# Criar environment.ts
cat > src/environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  serverUrl: 'http://localhost:3000/api',
  filesUrl: 'http://localhost:3000/files',
  chatUrl: 'http://localhost:3000',
};
EOF
```

### Frontend Admin

O arquivo `environment.ts` do admin já está configurado corretamente no repositório.

## 🐳 Configuração com Docker

### 1. Criar arquivo .env (opcional)

```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 2. Iniciar serviços

```bash
docker-compose up -d
```

Os Dockerfiles já estão configurados corretamente para criar o `environment.ts` automaticamente durante o build.

## 📋 Páginas do Frontend Web

Todas as páginas do marketplace público:

1. **Home** (`/home`) - Página inicial
2. **Login** (`/login`) - Autenticação
3. **Register** (`/register`) - Cadastro
4. **Select Country** (`/select-country`) - Seleção de país
5. **Catalogue** (`/catalogue`) - Catálogo de produtos
6. **Product Detail** (`/product/:id`) - Detalhes do produto
7. **Checkout** (`/checkout`) - Finalizar compra
8. **Purchase** (`/purchase`) - Confirmação de compra
9. **Profile** (`/profile/:id`) - Perfil público
10. **My Account** (`/my-account`) - Conta do usuário
11. **Help** (`/help`) - Ajuda
12. **Sale** (`/sale`) - Vendas do usuário
13. **Product Type** (`/product-type`) - Tipo de produto
14. **Product Add** (`/product-add`) - Adicionar produto
15. **Product Edit** (`/product-edit/:id`) - Editar produto
16. **Terms** (`/terms`) - Termos de uso
17. **Privacy** (`/privacy`) - Política de privacidade
18. **Mobile** (`/mobile`) - Versão mobile
19. **Recover Password** (`/recover-password`) - Recuperar senha
20. **Verification Code** (`/verification-code`) - Código 2FA
21. **Add Phone** (`/add-phone`) - Adicionar telefone

## 📋 Páginas do Frontend Admin

Todas as páginas do painel administrativo:

1. **Login** (`/login`) - Login admin
2. **Products** (`/products`) - Gerenciar produtos
3. **Sells** (`/sells`) - Vendas
4. **Retreats** (`/retreats`) - Saques
5. **Tickets** (`/tickets`) - Suporte
6. **Personalize** (`/personalize`) - Personalização
7. **Feedback** (`/feedback`) - Feedbacks
8. **Statistics** (`/statistics`) - Estatísticas
9. **Discount** (`/discount`) - Códigos de desconto
10. **Profits** (`/profits`) - Lucros
11. **Filters** (`/filters`) - Filtros
12. **Profile** (`/profile`) - Perfil admin
13. **Purchase** (`/purchase/:id`) - Detalhes da compra
14. **Users** (`/users`) - Usuários
15. **User View** (`/user-view/:id`) - Ver usuário
16. **Search Keywords** (`/searchKey`) - Palavras-chave

## 🔌 Endpoints Principais do Backend

### Autenticação e Usuários
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Perfil do usuário
- `POST /api/users/recoveryPassword` - Recuperar senha

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products/createNewProduct` - Criar produto
- `POST /api/products/loadProductContents` - Carregar conteúdos

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders/pay` - Pagar pedido
- `POST /api/orders/finish` - Finalizar pedido
- `GET /api/orders/userRecord` - Histórico

### Pagamentos
- `POST /api/mp/initPoint` - MercadoPago checkout
- `POST /api/discountCodes/check` - Validar cupom

### Outros
- `GET /api/categories` - Categorias
- `GET /api/games` - Jogos
- `GET /api/notifications` - Notificações
- `GET /api/conversations` - Conversas
- `POST /api/messages` - Mensagens
- `GET /api/health` - Health check

## ✅ Verificar se tudo está funcionando

### 1. Backend Health Check

```bash
curl http://localhost:3000/api/health
```

Deve retornar: `{"status":"ok","timestamp":"..."}`

### 2. Frontend Web

Acesse http://localhost:3001 - Deve carregar a página inicial

### 3. Frontend Admin

Acesse http://localhost:4300 - Deve carregar o login admin

### 4. MailHog (Email Testing)

Acesse http://localhost:8025 - Interface de emails de teste

### 5. MongoDB

```bash
docker-compose exec mongodb mongosh mercadogamer
```

## 🔧 Troubleshooting

### Erro: Cannot find module 'environment'

**Problema**: O arquivo `environment.ts` não foi criado.

**Solução**:
```bash
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/web
cat > src/environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  serverUrl: 'http://localhost:3000/api',
  filesUrl: 'http://localhost:3000/files',
  chatUrl: 'http://localhost:3000',
};
EOF
```

### Erro de CORS

**Problema**: Frontend não consegue acessar o backend.

**Solução**: Verifique se as portas estão corretas:
- Frontend Web deve estar em `localhost:3001` ou `localhost:4200`
- Frontend Admin deve estar em `localhost:4300` ou `localhost:5001`
- Backend deve estar em `localhost:3000`

### Porta já em uso

**Problema**: Porta 3000, 3001 ou 4300 já está em uso.

**Solução**: Edite `docker-compose.yml` para usar outras portas:
```yaml
ports:
  - "3002:3000"  # Backend
  - "3003:4200"  # Web
  - "4301:5001"  # Admin
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `docker-compose logs -f`
2. Reconstrua os containers: `docker-compose up -d --build`
3. Limpe e reinicie: `docker-compose down -v && docker-compose up -d --build`
