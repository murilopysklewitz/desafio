import { Router, Request, Response } from "express";
import { ConversaController } from "../ConversaController";

export async function conversaRoute() {
    const conversaRouter = Router()

    const conversaController = new ConversaController()

    conversaRouter.post('/', async (req: Request, res: Response) => {
        await conversaController.salvar(req, res);
    });

    conversaRouter.get('/:telefone', async (req: Request, res: Response) => {
        await conversaController.historico(req, res);
    });

    return conversaRouter;
}