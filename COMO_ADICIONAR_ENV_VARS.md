# 🎯 Como Adicionar Environment Variables no Easypanel

## 📋 Passo a Passo

### 1. Abra o Easypanel
- Acesse seu Easypanel
- Vá para o **projeto MercadoGamer**

### 2. Selecione o App do Backend
- Na lista de serviços, clique no **app do backend** (não no MongoDB)
- Deve ter um nome como "mercadogamer-api" ou similar

### 3. Encontre a Seção de Environment Variables
Procure por uma aba ou menu chamado:
- **"Environment"** ou
- **"Environment Variables"** ou
- **"Config"** ou
- **"Settings"**

### 4. Adicione CADA Variável Individualmente

**IMPORTANTE:** Adicione uma variável de cada vez!

#### Variável 1: DATABASE_HOST
```
Key: DATABASE_HOST
Value: private_mercadogamer-mongodb:27017
```

#### Variável 2: DATABASE_NAME
```
Key: DATABASE_NAME
Value: mercadogamer
```

#### Variável 3: MONGO_USER
```
Key: MONGO_USER
Value: admin
```

#### Variável 4: MONGO_PASSWORD
```
Key: MONGO_PASSWORD
Value: MercadoGamer2024!
```

#### Variável 5: NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### Variável 6: SOCKET_PORT_SOI
```
Key: SOCKET_PORT_SOI
Value: 10111
```

### 5. Salve as Variáveis
- Clique em **"Save"** ou **"Apply"**

### 6. Restart o Backend
- Procure botão **"Restart"** ou **"Redeploy"**
- Clique para reiniciar o container
- **NÃO precisa fazer Rebuild**, só Restart!

---

## ✅ Como Verificar se Funcionou

Após restart, vá em **Logs** e procure por:

```
📡 Connecting to MongoDB with authentication: admin@private_mercadogamer-mongodb:27017
✅ MongoDB connected successfully!
server listening at env: production or settings 10111
```

Se aparecer isso, **FUNCIONOU!** 🎉

---

## ❌ Se Ainda Der Erro

Se aparecer:
```
📡 Connecting to MongoDB without authentication: localhost:27017
❌ MongoDB connection error: connect ECONNREFUSED
```

Significa que as variáveis **NÃO foram salvas corretamente**.

**Solução:**
1. Verifique que você adicionou no **app do backend** (não no MongoDB)
2. Verifique que clicou em **Save**
3. Verifique que fez **Restart** depois de salvar
4. Me mostre uma screenshot da tela de Environment Variables

---

## 📞 Precisa de Ajuda?

Me mostre:
1. Screenshot da lista de apps (onde mostra MongoDB e Backend)
2. Screenshot da tela de Environment Variables do backend
3. Logs após o restart

---

**Boa sorte!** 🚀
