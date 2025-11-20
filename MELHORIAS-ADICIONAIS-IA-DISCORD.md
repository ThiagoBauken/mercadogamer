# 🤖 Melhorias Adicionais - IA & Discord & Mais

**Data:** 20/11/2025
**Foco:** Suporte IA, Discord, e Melhorias Rápidas de Alto Impacto

---

## 📋 Índice

1. [Suporte em Tempo Real com IA](#1-suporte-em-tempo-real-com-ia)
2. [Integração Discord](#2-integração-discord)
3. [Sistema de Notificações Push](#3-sistema-de-notificações-push)
4. [Chat Interno em Tempo Real](#4-chat-interno-em-tempo-real)
5. [Sistema de Reputação Avançado](#5-sistema-de-reputação-avançado)
6. [Melhorias de SEO](#6-melhorias-de-seo)
7. [Sistema de Favoritos/Wishlist](#7-sistema-de-favoritoswishlist)
8. [Comparador de Produtos](#8-comparador-de-produtos)
9. [Histórico de Preços](#9-histórico-de-preços)
10. [Quick Wins (Implementação Rápida)](#10-quick-wins)

---

## 1. 🤖 Suporte em Tempo Real com IA

### 1.1 Por que é Importante?

**Problema atual:**
- Suporte manual é caro e lento
- Usuários esperam muito por respostas
- Perguntas repetitivas consomem tempo da equipe

**Solução: Chatbot com IA**

**Benefícios:**
- ✅ Respostas instantâneas 24/7
- ✅ Reduz carga da equipe em 60-80%
- ✅ Melhora satisfação do cliente
- ✅ Coleta dados sobre dúvidas comuns
- ✅ Conversão: usuários que usam chat compram 40% mais

---

### 1.2 Opções de Implementação

#### **Opção 1: Chatbot Simples (FAQ Inteligente)**

**Tecnologia:** Dialogflow (Google) ou Botpress
**Custo:** Grátis até 1.000 conversas/mês
**Tempo:** 2-3 semanas

**Funcionalidades:**
- Responde perguntas frequentes
- Guia usuário para páginas relevantes
- Escalação para humano se necessário

**Exemplo de Fluxo:**

```
Usuário: Como faço para vender um jogo?
Bot: Para vender no MercadoGamer, siga estes passos:

1. Complete sua verificação (nível 2 mínimo)
2. Clique em "Vender" no menu
3. Preencha os detalhes do produto
4. Aguarde aprovação (24h)

[Botão: Começar a Vender]
[Botão: Ver Guia Completo]
[Botão: Falar com Humano]

Isso responde sua dúvida?
```

---

#### **Opção 2: IA Avançada (GPT-4 / Claude)**

**Tecnologia:** OpenAI GPT-4 API ou Anthropic Claude API
**Custo:** $0.03 por 1K tokens (~R$ 0,15 por conversa)
**Tempo:** 4-6 semanas

**Funcionalidades:**
- Compreensão de linguagem natural
- Respostas contextualizadas
- Acesso a dados do usuário (pedidos, anúncios)
- Suporte em múltiplos idiomas
- Aprende com conversas

**Exemplo de Fluxo:**

```
Usuário: Comprei uma conta de League mas não recebi o login
Bot: Entendi! Vejo que você comprou a conta #12345 há 2 horas.
     Deixe-me verificar o status...

     ✅ Pagamento confirmado
     ⏳ Vendedor tem até 24h para entregar

     Você quer que eu:
     1. Envie uma notificação urgente ao vendedor?
     2. Abra um ticket de suporte?
     3. Explique o processo de entrega?

Usuário: 1
Bot: Pronto! Notifiquei o vendedor João Silva (@joaosilva).
     Ele geralmente responde em menos de 1 hora.

     Vou monitorar e te atualizar por email quando houver resposta.

     Enquanto isso, tem algo mais que posso ajudar?
```

---

### 1.3 Implementação Técnica

#### **Arquitetura Recomendada**

```
┌─────────────────────────────────────────────────────┐
│                FRONTEND (Next.js)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │  Chat Widget (Flutuante - canto inferior)    │  │
│  │  - Ícone de chat                             │  │
│  │  - Notificação de nova mensagem              │  │
│  │  - Interface de conversação                  │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ WebSocket / REST
┌──────────────────────▼──────────────────────────────┐
│             BACKEND (Node.js/Express)               │
│  ┌──────────────────────────────────────────────┐  │
│  │  Chat Service                                │  │
│  │  - Recebe mensagens                          │  │
│  │  - Identifica intenção                       │  │
│  │  - Roteamento (Bot vs Humano)                │  │
│  │  - Contexto do usuário                       │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌──────▼───────┐
│  GPT-4 API   │ │ Database │ │ Human Agent  │
│  (OpenAI)    │ │ (MongoDB)│ │   Dashboard  │
└──────────────┘ └──────────┘ └──────────────┘
```

#### **Código de Exemplo: Chat Widget**

```typescript
// components/ChatWidget/ChatWidget.tsx
import { useState, useEffect, useRef } from 'react';
import { Fab, Badge, Drawer, Box, TextField, IconButton } from '@mui/material';
import { Chat as ChatIcon, Send, Close } from '@mui/icons-material';
import { io } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Conectar ao WebSocket
    socketRef.current = io(process.env.NEXT_PUBLIC_CHAT_WS_URL);

    socketRef.current.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (!open) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socketRef.current.on('typing', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    socketRef.current?.emit('message', input);
    setInput('');
  };

  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
        onClick={handleOpen}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon />
        </Badge>
      </Fab>

      {/* Drawer de Chat */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: 1100 }}
      >
        <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Suporte MercadoGamer</Typography>
              <Typography variant="caption" color="text.secondary">
                {typing ? 'Digitando...' : 'Estamos online'}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Mensagens */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.sender === 'user' ? 'white' : 'black',
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSend} color="primary">
                    <Send />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
```

#### **Backend: Chat Service**

```javascript
// api/modules/chat/service.js
const OpenAI = require('openai');
const User = require('../../models/User');
const Order = require('../../models/Order');
const ChatSession = require('../../models/ChatSession');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatService {
  async handleMessage(userId, message, sessionId) {
    // Buscar ou criar sessão
    let session = await ChatSession.findById(sessionId);
    if (!session) {
      session = await ChatSession.create({
        userId,
        messages: [],
        status: 'active',
      });
    }

    // Adicionar mensagem do usuário
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Buscar contexto do usuário
    const context = await this.getUserContext(userId);

    // Gerar resposta com IA
    const response = await this.generateAIResponse(session.messages, context);

    // Adicionar resposta do bot
    session.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    await session.save();

    return {
      response,
      sessionId: session._id,
    };
  }

  async getUserContext(userId) {
    const user = await User.findById(userId);
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      userName: user.name,
      kycLevel: user.kycLevel,
      memberSince: user.createdAt,
      totalOrders: recentOrders.length,
      recentOrders: recentOrders.map((o) => ({
        id: o._id,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      })),
    };
  }

  async generateAIResponse(messages, context) {
    const systemPrompt = `
Você é o assistente virtual do MercadoGamer, um marketplace de jogos digitais.

Contexto do usuário:
- Nome: ${context.userName}
- Nível KYC: ${context.kycLevel}
- Cliente desde: ${context.memberSince}
- Total de pedidos: ${context.totalOrders}

Instruções:
1. Seja amigável, prestativo e profissional
2. Use linguagem clara e objetiva
3. Para questões técnicas, ofereça soluções passo-a-passo
4. Se não souber a resposta, sugira escalar para um humano
5. Use emojis moderadamente
6. Sempre termine perguntando se pode ajudar em algo mais

Pedidos recentes do usuário:
${JSON.stringify(context.recentOrders, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  }

  async escalateToHuman(sessionId) {
    const session = await ChatSession.findById(sessionId);
    session.status = 'awaiting_agent';
    session.escalatedAt = new Date();
    await session.save();

    // Notificar equipe de suporte
    await this.notifySupportTeam(session);

    return {
      message: 'Transferindo para um atendente humano. Aguarde alguns instantes...',
    };
  }

  async notifySupportTeam(session) {
    // Implementar notificação (email, slack, etc.)
    console.log(`Nova conversa escalada: ${session._id}`);
  }
}

module.exports = new ChatService();
```

---

### 1.4 Perguntas Frequentes que o Bot Pode Responder

#### **Categoria: Compras**
1. Como faço para comprar?
2. Quais são as formas de pagamento?
3. Quanto tempo demora para receber?
4. Posso parcelar?
5. Como rastreio meu pedido?
6. O que fazer se não recebi meu produto?

#### **Categoria: Vendas**
1. Como começo a vender?
2. Quais são as taxas?
3. Quando recebo meu pagamento?
4. Posso vender contas de jogos?
5. Como faço para verificar minha conta?

#### **Categoria: Conta**
1. Como altero minha senha?
2. Como verifico meu CPF?
3. Como adiciono um telefone?
4. O que são os níveis de verificação?
5. Como faço para deletar minha conta?

#### **Categoria: Segurança**
1. MercadoGamer é seguro?
2. Como funciona a proteção ao comprador?
3. O que fazer se for vítima de golpe?
4. Como denuncio um vendedor?

---

### 1.5 Custos e ROI

**Opção 1: Chatbot Simples**
- Desenvolvimento: R$ 5.000-8.000
- Operação: Grátis (até 1K conversas/mês)
- Tempo: 2-3 semanas
- ROI: -60% tickets de suporte

**Opção 2: IA Avançada (GPT-4)**
- Desenvolvimento: R$ 10.000-15.000
- Operação: R$ 500-1.000/mês (conversas)
- Tempo: 4-6 semanas
- ROI: -80% tickets, +40% conversão

**Recomendação:** Começar com Opção 1, migrar para Opção 2 após validação

---

## 2. 🎮 Integração Discord

### 2.1 Por que Discord?

**Estatísticas:**
- 90% dos gamers usam Discord
- Comunidades ativas = engajamento alto
- Marketing orgânico (boca-a-boca)
- Suporte peer-to-peer

**Concorrentes:**
- ✅ **GGMax** tem comunidade Discord ativa
- ❌ **Desapego Games** não tem

---

### 2.2 Estrutura de Servidor Recomendada

```
🏠 SERVIDOR DISCORD: MercadoGamer Brasil

📢 INFORMAÇÕES
   ├─ 📜 regras
   ├─ 📰 novidades
   ├─ 🎉 eventos-e-sorteios
   └─ 📊 estatísticas

💬 GERAL
   ├─ 💭 geral
   ├─ 🛒 compra-e-venda
   ├─ ❓ duvidas
   └─ 🤝 trocas

🎮 JOGOS
   ├─ 🔥 league-of-legends
   ├─ 🎯 valorant
   ├─ 🔫 cs2
   ├─ 🎮 minecraft
   ├─ 🔥 free-fire
   └─ 🎲 outros-jogos

🛡️ SUPORTE
   ├─ 🎫 abrir-ticket
   ├─ ✅ verificacao-kyc
   └─ 📞 suporte-urgente

🏆 VENDEDORES
   ├─ 💎 vendedor-certificado (Nível 3 apenas)
   ├─ 📈 dicas-de-vendas
   └─ 📊 estatisticas-vendas

🎁 PROMOÇÕES
   ├─ 🎰 sorteios-semanais
   ├─ 💸 cupons-desconto
   └─ 🎮 torneios

🤖 BOT
   ├─ 🔔 notificacoes-vendas
   ├─ 📦 rastreamento-pedidos
   └─ 🎲 comandos-bot
```

---

### 2.3 Funcionalidades do Bot Discord

#### **1. Notificações Automáticas**

```
🔔 NOVA VENDA!

Parabéns @JoaoSilva! Você vendeu:
📦 Conta League of Legends - Gold II
💰 R$ 350,00

[Ver Detalhes] [Rastrear Pedido]
```

```
📦 PEDIDO ENTREGUE!

@MariaSantos, seu pedido foi entregue:
🎮 Skin AWP Dragon Lore CS2
✅ Comprador confirmou recebimento

Seu pagamento será liberado em 24h!
```

#### **2. Comandos do Bot**

```
!meus-pedidos
→ Lista últimos 5 pedidos

!minhas-vendas
→ Lista últimas 5 vendas

!saldo
→ Mostra saldo disponível

!verificacao
→ Status de verificação KYC

!ajuda
→ Lista de comandos

!rastrear #12345
→ Rastreia pedido específico

!promo
→ Cupons de desconto ativos
```

#### **3. Sistema de Níveis (Gamificação)**

```
🏆 SISTEMA DE XP E NÍVEIS

Nível 1 (0-100 XP): Iniciante 🌱
Nível 2 (100-500 XP): Membro 👤
Nível 3 (500-1500 XP): Ativo 💪
Nível 4 (1500-5000 XP): Veterano ⭐
Nível 5 (5000+ XP): Lenda 🏆

Ganhe XP:
+5 XP por mensagem (max 50/dia)
+50 XP por venda concluída
+20 XP por compra
+100 XP por verificação KYC nível 2
+200 XP por verificação KYC nível 3
+10 XP por avaliar produto
```

#### **4. Sorteios Automáticos**

```
🎰 SORTEIO SEMANAL!

Prêmio: Skin Valorant (R$ 150)
Participantes: 234
Encerra em: 2 dias

Para participar:
1. Estar no servidor
2. Ter nível 2+ de verificação
3. Reagir com 🎉

[🎉 Participar]
```

---

### 2.4 Implementação Técnica

#### **Discord Bot (Node.js)**

```javascript
// bot/discord-bot.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const API_BASE_URL = process.env.MERCADOGAMER_API_URL;

client.on('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Comando: !meus-pedidos
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!meus-pedidos') {
    try {
      // Buscar usuário vinculado
      const discordId = message.author.id;
      const response = await axios.get(`${API_BASE_URL}/discord/user/${discordId}/orders`);

      const orders = response.data.orders;

      if (orders.length === 0) {
        message.reply('Você ainda não tem pedidos!');
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📦 Seus Últimos Pedidos')
        .setDescription('Aqui estão seus últimos 5 pedidos:')
        .setTimestamp();

      orders.forEach((order, index) => {
        embed.addFields({
          name: `Pedido #${order.id}`,
          value: `
            **Status:** ${order.status}
            **Total:** R$ ${order.total}
            **Data:** ${new Date(order.createdAt).toLocaleDateString('pt-BR')}
          `,
          inline: true,
        });
      });

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Erro ao buscar pedidos. Você vinculou sua conta Discord?');
    }
  }

  // Comando: !verificacao
  if (message.content === '!verificacao') {
    try {
      const discordId = message.author.id;
      const response = await axios.get(`${API_BASE_URL}/discord/user/${discordId}/kyc`);

      const { kycLevel, badges } = response.data;

      const levelEmojis = {
        0: '⚪',
        1: '🔵',
        2: '🟢',
        3: '🏆',
      };

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🔐 Status de Verificação')
        .addFields(
          { name: 'Nível KYC', value: `${levelEmojis[kycLevel]} Nível ${kycLevel}`, inline: true },
          { name: 'Badges', value: badges.join(', ') || 'Nenhum', inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Erro ao verificar status KYC.');
    }
  }
});

// Notificação de nova venda (chamado pela API)
async function notifyNewSale(userId, saleData) {
  const user = await client.users.fetch(userId);
  if (!user) return;

  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('🎉 NOVA VENDA!')
    .setDescription(`Parabéns! Você vendeu:`)
    .addFields(
      { name: 'Produto', value: saleData.productName },
      { name: 'Valor', value: `R$ ${saleData.total}` },
      { name: 'Comprador', value: saleData.buyerName }
    )
    .setTimestamp();

  user.send({ embeds: [embed] });

  // Enviar também no canal #notificacoes-vendas
  const channel = client.channels.cache.get(process.env.DISCORD_SALES_CHANNEL_ID);
  if (channel) {
    channel.send({ content: `<@${userId}>`, embeds: [embed] });
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = { notifyNewSale };
```

#### **Vincular Conta Discord**

```javascript
// api/modules/discord/route.js
router.post('/link', authenticated, async (req, res) => {
  try {
    const { discordId, username } = req.body;
    const userId = req.user._id;

    // Verificar se discord já vinculado
    const existing = await User.findOne({ discordId });
    if (existing && existing._id.toString() !== userId.toString()) {
      throw new Error('Discord já vinculado a outra conta');
    }

    // Atualizar usuário
    await User.findByIdAndUpdate(userId, {
      discordId,
      discordUsername: username,
    });

    // Dar role no servidor Discord
    await discordService.assignRole(discordId, 'Membro Verificado');

    res.json({
      success: true,
      message: 'Discord vinculado com sucesso!',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
```

#### **Frontend: Botão de Vincular Discord**

```typescript
// components/Discord/LinkDiscordButton.tsx
import { Button } from '@mui/material';
import { SiDiscord } from 'react-icons/si';
import api from '@/services/api';

export default function LinkDiscordButton() {
  const handleLink = () => {
    // Abrir popup OAuth do Discord
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/discord/callback`
    );
    const scope = 'identify';

    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    window.open(authUrl, 'discord-auth', 'width=500,height=700');
  };

  return (
    <Button
      variant="outlined"
      startIcon={<SiDiscord />}
      onClick={handleLink}
      sx={{
        borderColor: '#5865F2',
        color: '#5865F2',
        '&:hover': {
          borderColor: '#4752C4',
          bgcolor: 'rgba(88, 101, 242, 0.1)',
        },
      }}
    >
      Vincular Discord
    </Button>
  );
}
```

---

### 2.5 Eventos e Sorteios

#### **Sorteio Semanal Automático**

```javascript
// bot/raffles/weekly-raffle.js
const cron = require('node-cron');

// Todo domingo às 20h
cron.schedule('0 20 * * 0', async () => {
  const participants = await RaffleEntry.find({ weekNumber: getCurrentWeek() });

  if (participants.length === 0) {
    console.log('Nenhum participante no sorteio');
    return;
  }

  // Sortear vencedor
  const winner = participants[Math.floor(Math.random() * participants.length)];

  // Notificar vencedor
  const channel = client.channels.cache.get(process.env.DISCORD_RAFFLE_CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('🎉 RESULTADO DO SORTEIO!')
    .setDescription(`Parabéns ao vencedor!`)
    .addFields(
      { name: 'Vencedor', value: `<@${winner.discordId}>` },
      { name: 'Prêmio', value: 'Skin Valorant (R$ 150)' },
      { name: 'Participantes', value: `${participants.length} pessoas` }
    )
    .setTimestamp();

  channel.send({ content: '@everyone', embeds: [embed] });

  // Creditar prêmio
  await creditPrize(winner.userId, 150);

  // Limpar participantes
  await RaffleEntry.deleteMany({ weekNumber: getCurrentWeek() });
});
```

---

### 2.6 Roles (Cargos) Automáticos

```javascript
// Atribuir roles baseado em KYC
const roleMapping = {
  0: null, // Sem verificação
  1: 'Verificado Nível 1', // Azul
  2: 'Identidade Verificada', // Verde
  3: 'Vendedor Certificado', // Dourado
};

async function updateDiscordRole(userId, kycLevel) {
  const user = await User.findById(userId);
  if (!user.discordId) return;

  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
  const member = await guild.members.fetch(user.discordId);

  // Remover roles antigas
  const oldRoles = Object.values(roleMapping).filter(Boolean);
  await member.roles.remove(oldRoles);

  // Adicionar role nova
  const newRole = roleMapping[kycLevel];
  if (newRole) {
    await member.roles.add(newRole);
  }
}
```

---

### 2.7 Link para Servidor Discord

#### **Onde Colocar o Link?**

1. **Header do Site**
```typescript
<IconButton href="https://discord.gg/mercadogamer" target="_blank">
  <SiDiscord />
</IconButton>
```

2. **Footer**
```typescript
<Link href="https://discord.gg/mercadogamer" target="_blank">
  <SiDiscord size={24} />
  Junte-se à nossa comunidade
</Link>
```

3. **Página de Perfil**
```
[ Vincular Discord ] → Ganhe 50 MG Points!
```

4. **Após Cadastro**
```
✅ Conta criada!

Próximos passos:
1. Verifique seu email
2. Complete verificação KYC
3. [Junte-se ao Discord] ← Ganhe bônus!
```

---

### 2.8 Custos e ROI

**Implementação:**
- Bot Discord: R$ 3.000-5.000
- Servidor (hosting): Grátis (100 bots grátis)
- Tempo: 2-3 semanas

**Benefícios:**
- +Engajamento (usuários ativos diariamente)
- +Retenção (comunidade forte)
- -Suporte (perguntas respondidas por membros)
- +Marketing orgânico (indicações)

**ROI:** 200-300% em 6 meses

---

## 3. 🔔 Sistema de Notificações Push

### 3.1 Tipos de Notificações

#### **Web Push (Navegador)**

```
🔔 Nova mensagem do vendedor!

João Silva respondeu sua dúvida sobre
"Conta League of Legends - Diamond"

[Ver Mensagem]
```

#### **Mobile Push (PWA)**

```
📦 Seu pedido foi enviado!

Pedido #12345 está a caminho
Prazo: 2-3 dias úteis

[Rastrear]
```

#### **Email**

```
Assunto: ⏰ Promoção Relâmpago!

Olá João,

O produto que você favoritou está em promoção!

Skin AWP Dragon Lore CS2
De: R$ 800,00
Por: R$ 600,00 (25% OFF)

[Comprar Agora]

Promoção válida por 24h!
```

---

### 3.2 Implementação (Web Push)

```javascript
// Frontend: Solicitar permissão
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Navegador não suporta notificações');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    // Registrar service worker
    const registration = await navigator.serviceWorker.register('/sw.js');

    // Obter subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // Enviar subscription para backend
    await api.post('/notifications/subscribe', {
      subscription: JSON.stringify(subscription),
    });
  }
}

// Backend: Enviar notificação
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:contato@mercadogamer.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushNotification(userId, payload) {
  const user = await User.findById(userId);
  const subscription = JSON.parse(user.pushSubscription);

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: '/logo.png',
      badge: '/badge.png',
      data: payload.data,
    })
  );
}
```

---

## 4. 💬 Chat Interno em Tempo Real

### 4.1 Chat Entre Comprador e Vendedor

```
┌─────────────────────────────────────────┐
│  Conversa com @JoaoSilva                │
│  Sobre: Conta League of Legends         │
├─────────────────────────────────────────┤
│  Você:                                  │
│  A conta tem quantas skins?             │
│  14:30                                  │
│                                         │
│                   @JoaoSilva:           │
│                   Tem 15 skins raras!   │
│                   Posso enviar print    │
│                                 14:32   │
│                                         │
│  Você:                                  │
│  Por favor! 😊                          │
│  14:33                                  │
│                                         │
│                   @JoaoSilva:           │
│                   [📷 imagem.png]       │
│                                 14:35   │
│                                         │
│  [Digite sua mensagem...]       [Enviar]│
└─────────────────────────────────────────┘
```

### 4.2 Funcionalidades

- ✅ Real-time (WebSocket)
- ✅ Indicador de "digitando..."
- ✅ Marcadores de lido/não lido
- ✅ Upload de imagens
- ✅ Histórico de conversas
- ✅ Notificações de nova mensagem
- ✅ Bloquear usuário
- ✅ Denunciar conversa

---

## 5. ⭐ Sistema de Reputação Avançado

### 5.1 Além das Avaliações Simples

**Sistema Atual (Básico):**
```
★★★★☆ 4.5/5 (123 avaliações)
```

**Sistema Proposto (Avançado):**
```
┌────────────────────────────────────────┐
│  João Silva  🏆 Vendedor Certificado   │
│  ★★★★★ 4.9/5 (523 avaliações)         │
├────────────────────────────────────────┤
│  📊 Estatísticas de Confiança:         │
│  ✅ Entrega no prazo: 98%              │
│  ✅ Produto conforme descrito: 97%     │
│  ✅ Comunicação: 5.0/5                 │
│  ✅ Taxa de resposta: < 1 hora         │
│  ✅ Vendas concluídas: 523             │
│  ✅ Membro desde: Jan 2023             │
├────────────────────────────────────────┤
│  🏅 Conquistas:                        │
│  🥇 Top Seller (500+ vendas)           │
│  ⚡ Resposta Rápida (< 1h)             │
│  💎 100% Satisfação (30 dias)          │
│  🎯 Especialista em League of Legends  │
└────────────────────────────────────────┘
```

### 5.2 Badges/Conquistas Automáticas

```javascript
const badges = {
  // Vendas
  first_sale: { name: '🎉 Primeira Venda', requirement: 'sales >= 1' },
  top_seller_10: { name: '🥉 Bronze Seller', requirement: 'sales >= 10' },
  top_seller_50: { name: '🥈 Silver Seller', requirement: 'sales >= 50' },
  top_seller_100: { name: '🥇 Gold Seller', requirement: 'sales >= 100' },
  top_seller_500: { name: '💎 Diamond Seller', requirement: 'sales >= 500' },

  // Velocidade
  fast_responder: { name: '⚡ Resposta Rápida', requirement: 'avgResponseTime < 1h' },
  lightning_delivery: { name: '🚀 Entrega Express', requirement: 'avgDeliveryTime < 1h' },

  // Qualidade
  perfect_month: { name: '💯 Mês Perfeito', requirement: '100% positive last 30 days' },
  five_star_king: { name: '⭐ Rei 5 Estrelas', requirement: 'rating >= 4.9 && reviews >= 100' },

  // Especialização
  lol_specialist: { name: '🎮 Expert LoL', requirement: 'lolSales >= 50' },
  valorant_specialist: { name: '🎯 Expert Valorant', requirement: 'valorantSales >= 50' },

  // Comunidade
  helpful_member: { name: '🤝 Membro Útil', requirement: 'helpfulVotes >= 50' },
  trusted_veteran: { name: '🛡️ Veterano Confiável', requirement: 'memberDays >= 365 && rating >= 4.5' },
};
```

---

## 6. 🔍 Melhorias de SEO

### 6.1 Quick Wins

#### **Meta Tags Dinâmicos**

```typescript
// pages/products/[id].tsx
export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id);

  return {
    props: {
      product,
      meta: {
        title: `${product.name} - MercadoGamer`,
        description: product.description.substring(0, 160),
        image: product.images[0],
        price: product.price,
        currency: 'BRL',
      },
    },
  };
}
```

#### **Schema.org (Rich Snippets)**

```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Conta League of Legends - Diamond",
  "image": "https://mercadogamer.com/produto.jpg",
  "description": "Conta verificada de League of Legends...",
  "brand": {
    "@type": "Brand",
    "name": "League of Legends"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://mercadogamer.com/produtos/123",
    "priceCurrency": "BRL",
    "price": "350.00",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "MercadoGamer"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "89"
  }
}
</script>
```

#### **Sitemap Dinâmico**

```javascript
// pages/sitemap.xml.ts
export async function getServerSideProps({ res }) {
  const products = await Product.find({ status: 'active' }).limit(50000);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://mercadogamer.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${products
        .map((product) => {
          return `
            <url>
              <loc>https://mercadogamer.com/produtos/${product._id}</loc>
              <lastmod>${product.updatedAt.toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}
```

---

## 7. ❤️ Sistema de Favoritos/Wishlist

```typescript
// Botão de Favoritar
<IconButton onClick={() => toggleFavorite(productId)}>
  {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
</IconButton>

// Notificação de promoção
// "O produto X da sua lista de desejos está em promoção!"
```

---

## 8. 🔄 Comparador de Produtos

```
┌─────────────────────────────────────────────────────┐
│  COMPARAR PRODUTOS                                  │
├────────────────┬────────────────┬───────────────────┤
│                │ Produto A      │ Produto B         │
├────────────────┼────────────────┼───────────────────┤
│ Preço          │ R$ 350         │ R$ 400            │
│ Rank           │ Diamond        │ Master            │
│ Skins          │ 15 skins       │ 23 skins          │
│ Vendedor       │ ⭐ 4.8 (123)   │ ⭐ 4.9 (456)      │
│ Entrega        │ Imediata       │ 24h               │
└────────────────┴────────────────┴───────────────────┘
```

---

## 9. 📈 Histórico de Preços

```
[Gráfico de linha mostrando variação de preço nos últimos 30 dias]

Preço Médio: R$ 375
Menor Preço: R$ 320 (15 dias atrás)
Maior Preço: R$ 420 (5 dias atrás)

💡 Este produto está 5% abaixo do preço médio!
```

---

## 10. ⚡ Quick Wins (Implementação Rápida)

### Melhorias que podem ser feitas em 1 semana:

#### **1. Loading States (Skeleton)**
```typescript
import { Skeleton } from '@mui/material';

{loading ? (
  <Skeleton variant="rectangular" width={300} height={200} />
) : (
  <ProductCard product={product} />
)}
```
**Benefício:** +UX, menos bounce rate
**Tempo:** 2-3 dias

---

#### **2. Error Boundaries**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToSentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
```
**Benefício:** Menos crashes, melhor UX
**Tempo:** 1 dia

---

#### **3. Breadcrumbs**
```typescript
<Breadcrumbs>
  <Link href="/">Home</Link>
  <Link href="/jogos">Jogos</Link>
  <Link href="/jogos/league-of-legends">League of Legends</Link>
  <Typography>Conta Diamond</Typography>
</Breadcrumbs>
```
**Benefício:** +SEO, +UX
**Tempo:** 1 dia

---

#### **4. Filtros Avançados**
```
☑️ Apenas Verificados
☑️ Entrega Imediata
☑️ Aceita Parcelamento
☐ Frete Grátis
```
**Benefício:** +Conversão
**Tempo:** 2-3 dias

---

#### **5. Badges Visuais**
```
[🔥 PROMOÇÃO] Conta League of Legends
[⚡ ENTREGA IMEDIATA] Skin CS2
[✅ VERIFICADO] Vendedor Certificado
```
**Benefício:** +Conversão, +Confiança
**Tempo:** 1 dia

---

## 📊 PRIORIZAÇÃO FINAL

### 🔴 CRÍTICO (Fazer AGORA)
1. ✅ **KYC** (já tem guia completo)
2. ✅ **Segurança** (rate limiting, helmet)
3. ✅ **i18n** (já tem guia completo)

### 🟡 ALTA PRIORIDADE (1-3 meses)
4. ✅ **Chatbot IA** (R$ 5-10K, ROI alto)
5. ✅ **Discord** (R$ 3-5K, engajamento)
6. ✅ **Notificações Push** (R$ 2-3K)
7. ✅ **Selos de Verificação** (já planejado)

### 🟢 MÉDIA PRIORIDADE (3-6 meses)
8. ✅ **Chat Interno** (R$ 8-12K)
9. ✅ **Sistema de Pontos** (R$ 10-20K)
10. ✅ **Reputação Avançada** (R$ 5-8K)

### ⚪ BAIXA PRIORIDADE (6-12 meses)
11. ✅ **Comparador de Produtos**
12. ✅ **Histórico de Preços**
13. ✅ **Wishlist Avançada**

### ⚡ QUICK WINS (1 semana cada)
14. ✅ **Loading States/Skeleton**
15. ✅ **Error Boundaries**
16. ✅ **Breadcrumbs**
17. ✅ **Filtros Avançados**
18. ✅ **Badges Visuais**

---

## 💰 INVESTIMENTO TOTAL

| Categoria | Investimento | Tempo | ROI |
|-----------|-------------|-------|-----|
| **Chatbot IA** | R$ 10K | 4-6 sem | 800% |
| **Discord** | R$ 5K | 2-3 sem | 300% |
| **Notificações** | R$ 3K | 1-2 sem | 200% |
| **Chat Interno** | R$ 12K | 6-8 sem | 400% |
| **Quick Wins** | R$ 2K | 1 sem | 500% |
| **TOTAL** | **R$ 32K** | **3-4 meses** | **600%** |

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Ler todos os guias criados**
2. ✅ **Priorizar 3-5 melhorias**
3. ✅ **Começar com Quick Wins** (1 semana)
4. ✅ **Implementar Chatbot IA** (alta ROI)
5. ✅ **Criar servidor Discord** (engajamento)
6. ✅ **Paralelo: Trabalhar em KYC** (obrigatório)

**Com estas melhorias, o MercadoGamer se tornará o marketplace #1 de games no Brasil!** 🚀

---

**Documento criado em:** 20/11/2025
**Versão:** 1.0
**Autor:** Análise Competitiva Completa
