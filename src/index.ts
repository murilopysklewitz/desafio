import express from 'express';
import dotenv from 'dotenv';

import { baileysConfig } from './config/baileysConfig';
import { botRoute } from './infrastructure/Api/express/routes/botRoute';
import { MessageHandler } from './infrastructure/MessageHandler';
import cardapioRoute from './infrastructure/Api/express/routes/cardapioRoute';
import pedidoRoute from './infrastructure/Api/express/routes/pedidoRoute';
import { pool, testarConexao } from './config/postgresConfig';
import { conversaRoute } from './infrastructure/Api/express/routes/conversaRoute';


async function main() {
  dotenv.config();

  const app = express();

  const PORT = process.env.PORT || 3000;
  const phoneNumber = process.env.PHONE_NUMBER || ""

  const sock = await baileysConfig()

  const botRouter = await botRoute(sock)
  const conversaRouter = await conversaRoute()

  new MessageHandler(sock)

  app.use(express.json());

  app.use('/api/cardapio', cardapioRoute);
  app.use('/api/pedidos', pedidoRoute);
  app.use('/api/bot', botRouter);
  app.use('/api/conversa', conversaRouter)

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