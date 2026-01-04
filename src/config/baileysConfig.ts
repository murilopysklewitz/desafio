import makeWASocket, { fetchLatestBaileysVersion, useMultiFileAuthState } from "baileys";
import pino from "pino";
import qrcode from "qrcode"

export async function baileysConfig() {

    const {state, saveCreds} = await useMultiFileAuthState("./auth")

    const {version} = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        auth: state,
        version,
        logger: pino({level: "silent"}),
        browser: ["Chrome", "Desktop", "1.0"]
        
    })

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on('connection.update', async(update) => {
        const {connection, lastDisconnect, qr} = update;

        if(qr){
            await qrcode.toFile("qrcode.png", qr)
            console.log("Leia o qrcode na em qrcode.png")
        }

        if(connection === 'open'){
            console.log("whatsapp conectado")
        }
        if(connection === 'close'){
            baileysConfig()
        }
    })

    return sock;
}