import axios from "axios";
import { WASocket } from "baileys";

export class MessageHandler{
    constructor(private readonly sock: WASocket){
        this.listener()
    }

    private async listener() {

        this.sock.ev.on('messages.upsert', async ({messages, type}) => {

            if(type != 'notify'){
                return;
            }
            console.log(messages)
            const msg = messages[0];

            if(!msg.message || msg.key.fromMe|| msg.key.remoteJid?.includes('@g.us')){
                return
            }

            const textFromZap = msg.message?.conversation;
            const from = msg.key.remoteJid

            if(!textFromZap)return
            if(!from)return

            const text = textFromZap.toLowerCase()

            const n8nStringConnection  = process.env.N8N_WEBHOOK;
            if(!n8nStringConnection){
                console.error("N8N_WEBHOOK não configurado")
                return;
            }

            try{
            console.log("Enviando pro n8n:", process.env.N8N_WEBHOOK, { from, text });
             await axios.post(n8nStringConnection, {from, text})
            }catch(error:any){
                console.error("Erro ao enviar webhook para n8n", error.message)
            }
        })
    }

}