# Plano de Atualização Completo

## Problema Atual
- Erro "Cannot read properties of null (reading 'useContext')" durante build
- Next.js 13.0.0 com next-i18next tendo problemas de SSR/SSG
- Dependências desatualizadas

## Solução: Atualização Estratégica

### Fase 1: Atualizar Nx (Build System)
- [ ] Atualizar @nrwl/next de 15.4.5 para 15.9.7 (última versão estável da série 15.x)
- [ ] Atualizar @nx/* packages para 15.9.7
- [ ] Testar build básico

### Fase 2: Atualizar Next.js
- [ ] Atualizar Next.js de 13.0.0 para 13.5.6 (última versão 13.5.x)
- [ ] Testar compatibilidade com Nx 15.9.7
- [ ] Verificar build

### Fase 3: Atualizar i18next Ecosystem
- [ ] Atualizar next-i18next para 15.4.2 (já está atualizado)
- [ ] Atualizar i18next para 23.17.4 (mais recente compatível com TS 4.8)
- [ ] Atualizar react-i18next para 14.1.3
- [ ] Testar translations

### Fase 4: Configurar SSR/SSG Corretamente
- [ ] Ajustar next-i18next.config.js
- [ ] Garantir que todas as páginas tenham getServerSideProps ou getStaticProps
- [ ] Configurar fallback para páginas dinâmicas

### Fase 5: Testes Iterativos
- [ ] Build de produção
- [ ] Corrigir erros conforme aparecem
- [ ] Testar funcionalidades no browser

## Versões Alvo
- @nrwl/next: 15.9.7
- next: 13.5.6
- react: 18.2.0 (manter)
- i18next: 23.17.4
- react-i18next: 14.1.3
- next-i18next: 15.4.2 (manter)
- typescript: 5.0.4 (atualizar)
