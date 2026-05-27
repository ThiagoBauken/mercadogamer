# 🗺️ MercadoGamer — Roadmap pós-migração

**Status atual**: stack modernizado, smoke tests passam, lógica de negócio competitiva (KYC, escrow, disputas) **ainda não implementada**.

Este roadmap parte do estado real de **27/05/2026** (ver `STATE.md`) e descreve o caminho honesto até "marketplace competitivo no nível de GGMax/Desapego Games".

---

## 🎯 Prioridades

Ordenadas por **(criticidade legal) × (custo de oportunidade competitivo)**.

### P0 — Sem isso, não tem produto

| # | Item | Esforço | Custo recorrente |
|---|---|---|---|
| 1 | ~~**KYC nível 1** (email + SMS + CPF Serpro)~~ ✅ **Backend pronto 27/05/2026** — falta tela no frontend | ~8h restantes (frontend) | R$ 50-200/mês |
| 2 | **Escrow real** no schema orders (estados `held` / `released`) | 30-40h | — |
| 3 | **Sistema de disputas** (dispute resolution flow) | 25-35h | — |
| 4 | **Selos verificados funcionais** (campos no schema users + lógica) | 8-12h | — |
| 5 | **Frontend i18n plugado** no `_app.tsx` | 4-8h | — |

### P1 — Diferencial competitivo

| # | Item | Esforço | Custo recorrente |
|---|---|---|---|
| 6 | **Planos de vendedor** (Silver/Gold/Diamond) via Stripe Subscriptions | 30-40h | 4,99% Stripe |
| 7 | **Seguro do vendedor** (fundo de reembolso 2% por venda) | 20-30h | — |
| 8 | **Sistema de reviews** com peso (comprador verificado vale mais) | 12-16h | — |
| 9 | **Deploy de produção sério** (MongoDB Atlas + Vercel + monitoring) | 12-16h | R$ 50-150/mês |
| 10 | **KYC nível 2** (foto + selfie + biometria AWS Rekognition) | 30-40h | R$ 0,01/img |

### P2 — Engajamento e escala

| # | Item | Esforço | Custo recorrente |
|---|---|---|---|
| 11 | **Discord** (server manual + bot de notificação) | 8-12h | — |
| 12 | **Login social** (Google, Discord) | 8-12h | — |
| 13 | **Newsletter** transacional (Resend/Mailgun) | 6-10h | R$ 0-100/mês |
| 14 | **SEO básico** (sitemap, schema.org, Open Graph) | 8-12h | — |
| 15 | **Chatbot IA** (GPT-4) — só faz sentido com volume | 16-24h | R$ 0,15/conversa |
| 16 | **Sistema de pontos / fidelização** | 24-32h | — |

### P3 — Futuro (não em 2026)

- App mobile (React Native) — só com 10k+ usuários web/mês
- AML/anti-money-laundering monitoring — só se virar entidade financeira
- Marketplace internacional (i18n completo) — depois de dominar BR

---

## 📅 Sequência sugerida (12 semanas)

```
sem 1     | Etapa 0 — Smoke test concluído ✅
sem 2-3   | P0.1 — KYC nível 1 (Serpro + SMS Twilio)
sem 4-5   | P0.2 — Escrow real + estados de order
sem 6     | P0.3 — Sistema de disputas (módulo)
sem 7     | P0.4 — Selos verificados + P0.5 — i18n plugado
sem 8-9   | P1.6 — Planos de vendedor (Stripe Subscriptions)
sem 10    | P1.7 — Seguro do vendedor (fundo de reembolso)
sem 11    | P1.9 — Deploy produção (MongoDB Atlas + Vercel)
sem 12    | P2.11-14 — Discord + Login social + SEO básico (paralelo)
```

**Marco intermediário (fim de semana 5)**: usuários podem cadastrar com KYC nível 1, criar pedido com escrow, e o sistema bloqueia ações se KYC não foi feito.

**MVP competitivo (fim de semana 11)**: site em produção, conformidade legal, escrow funcional, planos pagos, deploy resiliente. **Esse é o nível "compete com GGMax/Desapego"**.

---

## 💰 Investimento esperado

| Categoria | 12 semanas |
|---|---|
| **Dev** (~200h × R$ 100/h freelancer sênior) | R$ 20.000 |
| **APIs externas** (Serpro + Twilio + Stripe taxas + Atlas + email) | R$ 1.500 |
| **Domínio** (.com.br) + Cloudflare (free) | R$ 60 |
| **Total** | **~R$ 21.500** |

ROI realista depende de tração. Marketplaces precisam de **liquidez** (oferta × demanda balanceadas) — sem isso, gastar mais em código não move ponteiro.

---

## ⚠️ Riscos não-técnicos

1. **Chicken-and-egg**: sem vendedores, comprador não volta. Sem compradores, vendedor não fica. **Solução**: subsidiar primeiros 50-100 vendedores (taxa zero por 6 meses + comissão paga em "MG Points").
2. **Conformidade Lei 14.790/2023**: aposta/sorteio precisa de licença SECAP. Marketplace de contas de jogo está em **zona cinza** — pode ser interpretado como bem digital (OK) ou como aposta (regulado). Vale consultoria jurídica antes de escalar.
3. **Chargeback**: contas de jogo são alvo fácil de fraude. Stripe e MP cobram quando há disputa. Escrow + KYC bom mitigam, mas não eliminam.
4. **Concorrência estabelecida**: GGMax tem 8+ anos. Não dá pra vencer só com features. Diferencial precisa ser nicho específico (ex: focar em um jogo, ou em um país, ou em um segmento de preço).

---

## 🎯 Próximo passo concreto

Pos-migração (estado atual), o **único próximo passo** que destrava tudo é:

**Implementar KYC nível 1.**

Sem isso:
- Você opera fora da lei (LGPD + 14.790/2023)
- Selos verificados (já no frontend) não têm fonte de verdade
- Anti-fraude impossível (qualquer um cadastra com email descartável)
- Conta pra disputa fica vulnerável

Por que isso primeiro:
- É **obrigatório legal** (não opcional)
- É **fundamento** pra escrow, disputas, selos, planos
- É a feature **mais visível** vs concorrentes (GGMax cobra disso)

O passo seguinte (escrow) sai natural depois — usa o `kycLevel` no middleware de bloqueio.

Detalhamento técnico do KYC nível 1 fica em `KYC-IMPLEMENTATION.md` (a fazer).
