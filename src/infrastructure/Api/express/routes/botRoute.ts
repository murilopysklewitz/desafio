import { Router } from "express";
import { BotController } from "../botController";
import { Request, Response } from "express";
import { WASocket } from "baileys";


export async function botRoute(sock:WASocket){
const botRoute = Router()

const botController = new BotController(sock)

botRoute.post("/send-message", (req: Request, res: Response) =>{
    botController.handle(req, res)
})

return botRoute
}