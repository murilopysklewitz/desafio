import { Router, Request, Response } from 'express';
import { CardapioController } from '../CardapioController.js';
import { pool } from '../../../../config/postgresConfig.js';

const cardapioRoute = Router();
const controller = new CardapioController(pool);

cardapioRoute.get('/', async (req: Request, res: Response) => { 
    await controller.list(req, res);
});

cardapioRoute.get('/whatsapp', async (req: Request, res: Response) => {
    await controller.formatarParaWhatsApp(req, res);
});

cardapioRoute.get('/:id', async (req: Request, res: Response) => {
    await controller.findById(req, res);
});

export default cardapioRoute;