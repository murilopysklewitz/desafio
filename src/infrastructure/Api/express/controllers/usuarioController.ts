import { Request, Response } from "express"
import { IuserRepository } from "../../../../domain/gateway/userGateway";
import { Usuario } from "../../../../domain/Entity/Usuario";

export class UsuarioController{
    constructor(private readonly userRepository: IuserRepository) {
        
    }
    async save(req:Request, res: Response) {
        try{
        const {nome, telefone, endereco} = req.body;
        await this.userRepository.save(nome, telefone, endereco);
        return res.status(201).json({
            sucesso: true,
            mensagem: "Usuario criado com sucesso"
        })
        }catch(error: any){
            console.log("[SAVE USUARIO CONTROLLER] erro ao salvar usuario")

            return res.status(500).json({
                sucesso: false,
                erro: "[SAVE USUARIO CONTROLLER] Erro ao criar usuário"
              });
        }
    }
    async findByPhoneNumber(req:Request, res:Response){
        try {
            const {telefone} = req.params;
            const usuario = await this.userRepository.findByPhoneNumber(telefone)

            if(!usuario){
                return res.status(404).json({
                    sucesso: false,
                    erro:"Usuário não encontrado"
                })
            }

            res.status(200).json({sucesso: true, usuario})

            
        } catch (error: any) {
            console.error("[PROCURAR POR NUMERO DE TELEFONE USUARIO CONTROLLER] ERRO AO PROCURAR USUARIO", error.message)
            return res.status(500).json({
                sucesso: false,
                erro:"[PROCURAR POR NUMERO DE TELEFONE USUARIO CONTROLER] ERRO AO PROCURAR USUARIO"
            })
        }
    }
}