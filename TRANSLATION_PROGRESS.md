# MercadoGamer - Progresso da Tradução i18n (3 idiomas)

## STATUS GERAL
**Data**: 2025-11-20
**Idiomas**: pt-BR, en, es
**Progresso**: ~35% concluído

---

## CONCLUÍDO

### 1. Arquivos de Tradução Base
- ✅ `/apps/web/public/locales/pt-BR/dashboard.json` - COMPLETO
- ✅ `/apps/web/public/locales/en/dashboard.json` - COMPLETO
- ✅ `/apps/web/public/locales/es/dashboard.json` - COMPLETO
- ✅ `/apps/web/public/locales/{pt-BR,en,es}/common.json` - JÁ EXISTIAM
- ✅ `/apps/web/public/locales/{pt-BR,en,es}/auth.json` - JÁ EXISTIAM
- ✅ `/apps/web/public/locales/{pt-BR,en,es}/products.json` - JÁ EXISTIAM
- ✅ `/apps/web/public/locales/{pt-BR,en,es}/checkout.json` - JÁ EXISTIAM

### 2. Componentes Dashboard Traduzidos
- ✅ **Inventory** (`apps/web/src/page-contents/dashboard/inventory/index.tsx`)
  - Adicionado `useTranslation('dashboard')`
  - Todos os textos traduzidos (títulos, labels, botões, filtros, tabelas)
  - Filtros mobile traduzidos

- ✅ **Shopping/Orders** (`apps/web/src/page-contents/dashboard/shopping/index.tsx`)
  - Adicionado `useTranslation('dashboard')`
  - Cards de estatísticas traduzidos
  - Tabela e filtros traduzidos
  - Menu de ações traduzido

- ⚠️ **Sales** (`apps/web/src/page-contents/dashboard/sale/index.tsx`)
  - Hook `useTranslation` adicionado
  - PENDENTE: Traduzir JSX (títulos, tabelas, filtros, botões)

- ⚠️ **Profile** (`apps/web/src/page-contents/dashboard/profile/index.tsx`)
  - Hook `useTranslation` adicionado
  - Título e mensagem de foto traduzidos
  - PENDENTE: Traduzir labels dos form inputs, placeholders, validações

---

## PENDENTE (ALTA PRIORIDADE)

### Dashboard Pages
1. **Sales** (finish translation)
   - Filtros de status e data
   - Tabela (headers)
   - Cards de analytics
   - Botão "Cargar mas"

2. **Profile** (finish translation)
   - FormInput labels: Nome, Sobrenome, Username, etc
   - FormSelect labels: Província, País
   - Mensagens de validação
   - Botão Guardar

3. **Support** (`apps/web/src/page-contents/dashboard/support/index.tsx`)
   - Título e descrição
   - "Generar ticket"
   - "Tus tickets"
   - Conteúdo dos tickets

4. **Balance** (`apps/web/src/page-contents/dashboard/balance/index.tsx`)
   - NÃO VERIFICADO - precisa análise

5. **Add Product** (`apps/web/src/page-contents/dashboard/add-product/index.tsx`)
   - NÃO VERIFICADO - precisa análise

### Modais Principais
1. **Signup** (`apps/web/src/components/signup/index.tsx`)
2. **Reset Password** (`apps/web/src/components/reset-password/index.tsx`)
3. **Confirm Modal** (`apps/web/src/components/confirm-modal/index.tsx`)
4. **Cancel Order Modal** (`apps/web/src/components/cancel-order-modal/index.tsx`)
5. **Report Modal** (`apps/web/src/components/report-modal/index.tsx`)
6. **Invite Modal** (`apps/web/src/components/invite-modal/index.tsx`)
7. **Create Feedback** (`apps/web/src/components/create-feedback/index.tsx`)

### Páginas Principais
1. **Product Detail** (`apps/web/src/page-contents/product-detail/index.tsx`)
   - Widgets: product-info, product-questions, purchase-condition

2. **Checkout** (`apps/web/src/page-contents/checkout/index.tsx`)

3. **Cart** (`apps/web/src/page-contents/cart/index.tsx`)

4. **Catalog** (`apps/web/src/page-contents/catalogo/index.tsx`)

### Outros Componentes
- **Notification Menu** - tradução parcial
- **Order Status Badge** - verificar
- **Shortcut Menu**
- **Vendor Item**
- **Related Product**

---

## ARQUIVOS DE TRADUÇÃO NECESSÁRIOS

### Criar Novos Namespaces
```bash
# Modals (para todos os modais)
apps/web/public/locales/pt-BR/modals.json
apps/web/public/locales/en/modals.json
apps/web/public/locales/es/modals.json
```

### Estrutura Sugerida - modals.json
```json
{
  "signup": { ... },
  "reset_password": { ... },
  "confirm": { ... },
  "cancel_order": { ... },
  "report": { ... },
  "invite": { ... },
  "feedback": { ... }
}
```

---

## ESTATÍSTICAS

### Concluído
- **Arquivos JSON criados**: 3 (dashboard.json em 3 idiomas)
- **Componentes traduzidos**: 2.5 (Inventory, Shopping, Sales parcial)
- **Linhas de tradução**: ~120+ chaves
- **Componentes com hook i18n**: 4

### Pendente
- **Componentes Dashboard**: 5
- **Modais**: 7
- **Páginas principais**: 4
- **Estimativa de chaves**: ~300-400

---

## PRÓXIMOS PASSOS

### Imediato (Fase 2A - Dashboard)
1. Finalizar Sales page (10 min)
2. Finalizar Profile page (15 min)
3. Traduzir Support page (10 min)
4. Verificar/traduzir Balance (15 min)
5. Verificar/traduzir Add Product (20 min)

### Fase 2B - Modais (2-3 horas)
1. Criar modals.json (3 idiomas)
2. Traduzir todos os 7 modais
3. Testar funcionamento

### Fase 2C - Páginas Principais (3-4 horas)
1. Product Detail completo
2. Cart e Checkout
3. Catalog

### Fase 3 - Testes e QA
1. Testar troca de idiomas
2. Verificar placeholders dinâmicos
3. Testar responsividade dos textos
4. Validar todos os namespaces

---

## COMANDOS ÚTEIS

### Testar build
```bash
cd apps/web
npm run build
```

### Verificar arquivos de tradução
```bash
find apps/web/public/locales -name "*.json" -type f
```

### Grep por textos hardcoded (espanhol)
```bash
grep -r "Eliminar\|Agregar\|Producto" apps/web/src/page-contents/dashboard --include="*.tsx"
```

---

## NOTAS

### Padrões Estabelecidos
- Namespace `dashboard` para todas as páginas de dashboard
- Namespace `common` para UI genérica
- Namespace `auth` para login/registro
- Namespace `products` para listagens de produtos
- Namespace `checkout` para carrinho e checkout

### Convenções
- Chaves em snake_case: `inventory.add_product`
- Placeholders em {{brackets}}: `{{count}}`
- Plural com sufixo `_plural`: `publications_count_plural`

