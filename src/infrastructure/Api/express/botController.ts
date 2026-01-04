import { WASocket } from "baileys";
import { Response, Request } from "express";

export class BotController {
    constructor(private readonly sock: WASocket) {

    }
    async handle(request: Request, response: Response) {
        try {
            const { to, text } = request.body;

            if (!to || !text) {
                console.error("Está faltando destinatário e texto", to, text)
                response.status(400).json("Destinatário ou texto nulo")
                return
            }
            await this.sock.sendMessage(to, { text })
            return response.json({
                to: to,
                text: text
            })
        } catch (error: any) {
            console.error("Erro ao enviar mensagem:", error);

            return response.status(500).json({
                sucesso: false,
                erro: "Erro ao enviar mensagem"
            });
        }
    }
}