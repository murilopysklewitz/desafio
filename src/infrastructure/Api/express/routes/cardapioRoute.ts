import { Router } from 'express';
import { CardapioController } from '../CardapioController.js';
import { pool } from '../../../../config/postgresConfig.js';

const cardapioRoute = Router();
const controller = new CardapioController(pool);

cardapioRoute.get('/', controller.list);
cardapioRoute.get('/:id', controller.findById);

export default cardapioRoute;