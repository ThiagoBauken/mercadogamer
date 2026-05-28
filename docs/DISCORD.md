# 🎮 Discord setup — MercadoGamer

Guia pra criar Discord server da comunidade + bot que integra com API do MercadoGamer.

GGMax tem Discord ativo. Desapego Games NÃO tem. Esse é um diferencial competitivo barato (você cria server em 30min, bot em 2-3h).

---

## 🏛️ Estrutura recomendada do server

Categorias e canais sugeridos:

```
📢 INFORMAÇÃO
├─ #regras
├─ #anuncios          (announcement channel — só admin posta)
├─ #novidades         (releases, novos jogos)
└─ #suporte           (canal pra abrir ticket)

💬 COMUNIDADE
├─ #geral
├─ #compras-e-vendas
├─ #dicas-de-segurança
└─ #off-topic

🎮 POR JOGO
├─ #league-of-legends
├─ #valorant
├─ #counter-strike
├─ #free-fire
├─ #fortnite
├─ #fifa-ea-sports-fc
└─ ... (criar conforme demanda)

👥 VENDEDORES
├─ #vendedores-iniciantes
├─ #vendedores-pro       (pra plano Pro+)
└─ #vendedores-premium   (pra plano Premium)

🎁 EVENTOS
├─ #sorteios
└─ #giveaways

🔒 STAFF (private)
├─ #moderacao
└─ #disputas-pendentes   (bot notifica admin de disputas em admin_review)
```

---

## 🛠️ Passo 1 — Criar o server (15min)

1. Abrir Discord → click em `+` na sidebar esquerda → "Criar meu próprio"
2. Nome: `MercadoGamer` (ou `MercadoGamer Brasil`)
3. Upload ícone (pode usar `MercadoGamer/apps/web/public/favicon.svg`)
4. Criar todos os canais conforme estrutura acima
5. Configurar **Server Settings → Roles**:
   - `@admin` (todos permissões)
   - `@moderador` (gerenciar mensagens + kick)
   - `@vendedor-verificado` (KYC nível 2 — cor amarela ouro)
   - `@vendedor-pro` (cor azul)
   - `@vendedor-premium` (cor dourada)
   - `@membro` (default — sem cor)

6. **Onboarding**: Server Settings → Onboarding → ON
   - 3 perguntas: "Você compra ou vende?", "Quais jogos joga?", "Idade?"
   - Auto-assign canais relevantes baseado em respostas

---

## 🤖 Passo 2 — Criar bot Discord

### 2a. Criar aplicação Discord

1. Acessar https://discord.com/developers/applications
2. **New Application** → nome `MercadoGamer Bot`
3. Bot tab → **Add Bot** → copie o **TOKEN** (`MTxxx.xxx.xxx`)
4. **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Embed Links`, `Read Message History`, `Manage Roles`, `Use Slash Commands`
5. Copiar URL gerada e abrir no browser → autorizar bot no seu server

### 2b. Esqueleto do bot

Diretório recomendado: `discord-bot/` na raiz do projeto (separado do backend).

Estrutura:
```
discord-bot/
├── package.json
├── .env.example
├── index.js                       # entry point
├── commands/
│   ├── meu-saldo.js
│   ├── verificacao.js
│   └── ping.js
└── lib/
    └── api.js                     # client da API MercadoGamer
```

**`discord-bot/package.json`**:
```json
{
  "name": "mercadogamer-bot",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node --require dotenv/config index.js",
    "dev": "node --require dotenv/config --watch index.js"
  },
  "dependencies": {
    "discord.js": "^14.16.0",
    "axios": "^1.7.7",
    "dotenv": "^16.4.5"
  },
  "engines": { "node": ">=20" }
}
```

**`discord-bot/.env.example`**:
```
DISCORD_TOKEN=
DISCORD_GUILD_ID=
MERCADOGAMER_API_URL=http://localhost:3000/api
# Token de service account no MercadoGamer (criar admin user dedicado)
MERCADOGAMER_BOT_TOKEN=
```

**`discord-bot/index.js`**:
```js
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Carregar comandos
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
const commandsData = [];

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    commandsData.push(command.data.toJSON());
  }
}

// Registrar slash commands na guild
client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Bot logado como ${c.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(c.user.id, process.env.DISCORD_GUILD_ID),
      { body: commandsData }
    );
    console.log(`✅ ${commandsData.length} comandos registrados`);
  } catch (err) {
    console.error('Erro registrando comandos:', err);
  }
});

// Handler de interações
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    const errMsg = { content: '❌ Erro ao processar comando', ephemeral: true };
    if (interaction.replied) await interaction.followUp(errMsg);
    else await interaction.reply(errMsg);
  }
});

client.login(process.env.DISCORD_TOKEN);
```

**`discord-bot/lib/api.js`**:
```js
const axios = require('axios');

const api = axios.create({
  baseURL: process.env.MERCADOGAMER_API_URL,
  headers: {
    'x-access-token': process.env.MERCADOGAMER_BOT_TOKEN,
  },
  timeout: 8000,
});

module.exports = { api };
```

**`discord-bot/commands/ping.js`**:
```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Verifica se o bot está vivo'),
  async execute(interaction) {
    await interaction.reply(`🏓 Pong! Latency ${Date.now() - interaction.createdTimestamp}ms`);
  },
};
```

**`discord-bot/commands/meu-saldo.js`**:
```js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { api } = require('../lib/api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meu-saldo')
    .setDescription('Mostra seu saldo atual no MercadoGamer')
    .addStringOption(o => o.setName('username').setDescription('Seu username no site').setRequired(true)),
  async execute(interaction) {
    const username = interaction.options.getString('username');
    await interaction.deferReply({ ephemeral: true });
    try {
      // Endpoint hipotético: precisaria criar /api/users/by-username/:username no backend
      const resp = await api.get(`/users/by-username/${encodeURIComponent(username)}`);
      const user = resp.data?.data || resp.data;
      if (!user) {
        return interaction.editReply(`❌ Usuário **${username}** não encontrado`);
      }
      const embed = new EmbedBuilder()
        .setTitle(`Saldo de ${user.username}`)
        .setColor(0x4CAF50)
        .addFields(
          { name: 'Saldo', value: `R$ ${(user.balance || 0).toFixed(2)}`, inline: true },
          { name: 'KYC Level', value: String(user.kycLevel || 0), inline: true },
          { name: 'Plano', value: user.sellerPlan || 'free', inline: true },
        );
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(`❌ Erro: ${err.response?.data?.message || err.message}`);
    }
  },
};
```

**`discord-bot/commands/verificacao.js`**:
```js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verificacao')
    .setDescription('Como verificar sua conta MercadoGamer'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🔐 Como verificar sua conta')
      .setColor(0x2196F3)
      .setDescription('Verifique sua identidade pra ganhar selo "Verificado" e poder vender.')
      .addFields(
        { name: '1️⃣ Email', value: 'Receba um link no email e clique pra confirmar', inline: false },
        { name: '2️⃣ Telefone', value: 'Receba código SMS de 6 dígitos', inline: false },
        { name: '3️⃣ CPF', value: 'Validamos junto à Receita Federal', inline: false },
        { name: '4️⃣ (Opcional) Foto + Selfie', value: 'KYC nível 2 — biometria facial', inline: false },
      )
      .setFooter({ text: 'Acesse: mercadogamer.com.br/dashboard/kyc' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
```

### 2c. Como rodar localmente

```bash
cd discord-bot
npm install
cp .env.example .env
# editar .env com DISCORD_TOKEN e DISCORD_GUILD_ID
npm run dev
```

### 2d. Deploy do bot

Mesma máquina do backend (Easypanel) — criar um service novo:
- Build: `cd discord-bot && npm ci`
- Run: `node --require dotenv/config index.js`
- Restart: `unless-stopped`
- Env: `DISCORD_TOKEN`, `DISCORD_GUILD_ID`, `MERCADOGAMER_API_URL`, `MERCADOGAMER_BOT_TOKEN`

Custo: zero (sem hospedagem extra, Discord não cobra por bot).

---

## 🔔 Próximos passos (iterações)

| Feature | Esforço |
|---|---|
| Bot notifica admin em #disputas-pendentes quando dispute escala | 3h |
| Notifica vendedor por DM quando recebe nova venda | 4h |
| Comando `/sorteio` que cria giveaway com botão de participar | 6h |
| Sync de roles automático: kycLevel ≥ 1 ganha `@verificado` | 4h |
| Embed bonita de produto via `/produto <id>` | 2h |
| OAuth Discord no site → login social | 6h |

---

## 💡 Estratégia de crescimento da comunidade

1. **Pinar mensagem fixa** em #regras com link pro site
2. **Boas-vindas automáticas**: bot envia DM ao novo membro com instruções
3. **Eventos semanais**: sorteio de R$ 50 toda sexta (custo R$ 200/mês = marketing barato)
4. **Selo Discord** no perfil: usuários que sincronizaram Discord ganham badge no site
5. **Anunciar lançamentos no #anuncios** (KYC nível 2, novos jogos, etc)

Importante: **comunidade morta = pior que sem comunidade**. Só criar Discord quando estiver pronto pra moderar ativamente nas primeiras 2-3 semanas.
