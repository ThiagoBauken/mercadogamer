# ⚡ Como Enviar para GitHub - Guia Rápido

## 🎯 3 Passos Simples

### **Passo 1: Criar Repositório no GitHub**

1. Vá para: https://github.com/new
2. Nome: `mercadogamer`
3. ❌ NÃO marque nada (sem README, sem .gitignore, sem license)
4. Clique **Create repository**
5. **Copie a URL** que aparecer (ex: `https://github.com/SEU_USUARIO/mercadogamer.git`)

---

### **Passo 2: Conectar e Enviar**

Abra o terminal e execute:

```bash
cd C:\Users\Thiago\Desktop\marketplace

# Conectar ao GitHub (substitua SEU_USUARIO!)
git remote add origin https://github.com/SEU_USUARIO/mercadogamer.git

# Enviar código
git push -u origin master
```

**Se pedir login:**
- Username: seu_usuario_github
- Password: seu_token (não a senha!)

**Não tem token?** Veja "Como Criar Token" abaixo ↓

---

### **Passo 3: Verificar**

1. Acesse: `https://github.com/SEU_USUARIO/mercadogamer`
2. Veja se os arquivos estão lá! ✅

---

## 🔑 Como Criar Personal Access Token (Se Necessário)

Se o `git push` pedir senha:

1. GitHub → Foto do perfil → **Settings**
2. No menu lateral → **Developer settings** (último item)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Note: `MercadoGamer Deploy`
6. Expiration: `No expiration` (ou 90 days)
7. Marque apenas: **☑ repo** (full control of private repositories)
8. **Generate token**
9. **COPIE O TOKEN** (só aparece uma vez!)
10. Use como senha no `git push`

---

## 🚨 Problemas Comuns

### Erro: "remote origin already exists"

```bash
# Remover origin existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU_USUARIO/mercadogamer.git
```

---

### Erro: "Authentication failed"

**Solução:** Você provavelmente usou senha ao invés do token.

Criar token (veja acima ↑) e usar no lugar da senha.

---

### Erro: "Branch main não existe"

```bash
# Renomear branch para main
git branch -M main

# Enviar
git push -u origin main
```

---

### Erro: "Permission denied"

Você não tem acesso ao repositório. Verifique:
- URL está correta?
- Repositório existe?
- Você é o dono ou colaborador?

---

## ✅ Depois do Push

1. ✅ Código no GitHub
2. ✅ Pode deletar pasta local (se quiser)
3. ✅ Pode clonar em outro PC: `git clone URL`
4. ✅ **Pronto para deploy no Easypanel!** → Ver [DEPLOY_EASYPANEL.md](DEPLOY_EASYPANEL.md)

---

## 🔄 Atualizações Futuras

Quando fizer mudanças no código:

```bash
cd C:\Users\Thiago\Desktop\marketplace

# Ver mudanças
git status

# Adicionar
git add .

# Commit
git commit -m "Descrição do que mudou"

# Enviar
git push
```

Simples assim! 🎉

---

## 📋 Checklist

- [ ] Repositório criado no GitHub
- [ ] URL do repositório copiada
- [ ] `git remote add origin URL` executado
- [ ] `git push -u origin master` executado
- [ ] Token criado (se necessário)
- [ ] Código aparecendo no GitHub
- [ ] Pronto para Easypanel!

---

**Próximo passo:** [Deploy no Easypanel](DEPLOY_EASYPANEL.md) 🚀
