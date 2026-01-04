import express from 'express';
import dotenv from 'dotenv';

import { baileysConfig } from './config/baileysConfig';
import { botRoute } from './infrastructure/Api/express/routes/botRoute';
import { MessageHandler } from './infrastructure/MessageHandler';
import cardapioRoute from './infrastructure/Api/express/routes/cardapioRoute';
import pedidoRoute from './infrastructure/Api/express/routes/pedidoRoute';
import { pool, testarConexao } from './config/postgresConfig';
export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
  criado_em: Date;
}

export interface ItemPedido {
  id: number;
  quantidade: number;
}

export interface Pedido {
  id: number;
  protocolo: string;
  telefone: string;
  itens: any;
  valor_total: number;
  status: string;
  endereco: string;
  criado_em: Date;
}

export interface Conversa {
  id: number;
  telefone: string;
  mensagem: string;
  resposta: string | null;
  tipo: string | null;
  criado_em: Date;
}

async function main() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3000;
  const phoneNumber = process.env.PHONE_NUMBER || ""
  const sock = await baileysConfig()

  const botRouter = await botRoute(sock)
  const messageHandler = new MessageHandler(sock)

  app.use(express.json());

  app.use('/api/cardapio', cardapioRoute);
  app.use('/api/pedidos', pedidoRoute);
  app.use('/api/bot', botRouter)

  try {
    const conectado = await testarConexao();

    if (!conectado) {
      console.error('falha ao conectar no banco. Encerrando...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao iniciar:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', async () => {
  console.log('Encerrando conexões...');
  await pool.end();
  process.exit(0);
});

main();