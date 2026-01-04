import { Router } from 'express';
import { PedidoController } from '../PedidoController.js';
import { pool } from '../../../../config/postgresConfig.js';

const pedidoRoute = Router();
const controller = new PedidoController(pool);

pedidoRoute.post('/', controller.criar);
pedidoRoute.get('/:protocolo', controller.consultar);

export default pedidoRoute;