WhatsApp Bot com Baileys + n8n + API Node.js

Este projeto é um bot de WhatsApp que utiliza a biblioteca Baileys para receber e enviar mensagens, n8n para orquestrar fluxos e decisões (incluindo IA no futuro), e uma API Node.js (Express) para regras de negócio como cardápio, pedidos etc.

A ideia central é:

📩 WhatsApp recebe mensagem → 🔁 envia para n8n via webhook → 🧠 n8n decide o que fazer → 📤 API responde → 📱 WhatsApp envia resposta

🧱 Arquitetura Geral
WhatsApp
   ↓
Baileys (WebSocket)
   ↓
MessageHandler
   ↓ (axios)
Webhook n8n
   ↓
Switch / IA / Lógica
   ↓ (HTTP)
API Node.js (Express)
   ↓
Baileys envia resposta

🛠️ Tecnologias Utilizadas

Node.js

Express

Baileys (WhatsApp Web API)

n8n (workflow automation)

PostgreSQL

Docker & Docker Compose

Axios

dotenv

📦 Estrutura do Projeto
/
├── api/
│   ├── src/
│   │   ├── config/
│   │   │   ├── baileysConfig.ts
│   │   │   └── postgresConfig.ts
│   │   ├── bot/
│   │   │   ├── MessageHandler.ts
│   │   │   ├── BotController.ts
│   │   │   └── botRoute.ts
│   │   ├── routes/
│   │   │   ├── cardapioRoute.ts
│   │   │   └── pedidoRoute.ts
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md

🔌 Como funciona o WhatsApp (Baileys)

A conexão é feita via Baileys

Ao rodar a aplicação pela primeira vez, é gerado um QR Code

Após escanear, o WhatsApp fica conectado

Mensagens recebidas disparam o evento:

sock.ev.on('messages.upsert', ...)

📩 MessageHandler (Webhook para n8n)

Classe responsável por:

Escutar mensagens do WhatsApp

Extrair from e text

Enviar os dados para o n8n via webhook

axios.post(process.env.N8N_WEBHOOK!, {
  from,
  text
});


Exemplo de payload enviado ao n8n:

{
  "from": "5511999999999@s.whatsapp.net",
  "text": "Cardápio"
}

🔁 n8n (Cérebro do Bot)

No n8n:

Um Webhook (POST) recebe a mensagem

Um Edit Fields (Raw) normaliza os dados

Um Switch Node decide a ação com base no texto

"oi", "olá", "bom dia" → mensagem de boas-vindas

"cardápio" → chama API

Pode ser facilmente estendido para:

IA (OpenAI)

Classificação de intenção

Histórico de conversa

⚠️ Importante:

Webhook de produção só funciona após clicar em “Publish”

URL usada pela API:

http://n8n:5678/webhook/botApi

📤 Envio de Mensagens (API → WhatsApp)

A API possui uma rota para envio de mensagens:

POST /api/bot/send-message

Body:

{
  "to": "5511999999999@s.whatsapp.net",
  "text": "Olá! 👋"
}


Internamente:

sock.sendMessage(to, { text });

🍽️ Cardápio

Rota usada pelo n8n:

GET http://api:3000/api/cardapio/whatsapp


Ela retorna os itens do cardápio formatados para WhatsApp.

🐳 Docker & Docker Compose

O projeto roda com Docker Compose, contendo:

API Node.js

PostgreSQL

n8n

Subir tudo:
docker compose up -d --build

Containers se comunicam via nome do serviço:

API → api

PostgreSQL → postgres

n8n → n8n

🌐 URLs Importantes
Do host (seu PC):

API:

http://localhost:3000


n8n UI:

http://localhost:5678

Entre containers:

API → n8n:

http://n8n:5678/webhook/botApi


n8n → API:

http://api:3000/api/cardapio/whatsapp

🧪 Testes com curl

Enviar mensagem manualmente para o bot:

curl -X POST http://localhost:3000/api/bot/send-message \
  -H "Content-Type: application/json" \
  -d '{"to":"5511999999999@s.whatsapp.net","text":"oi"}'


Simular webhook do WhatsApp:

curl -X POST http://localhost:5678/webhook/botApi \
  -H "Content-Type: application/json" \
  -d '{"from":"teste","text":"cardapio"}'