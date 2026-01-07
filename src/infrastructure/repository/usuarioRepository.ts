import { Pool } from "pg";
import { Usuario } from "../../domain/Entity/Usuario";
import { IuserRepository } from "../../domain/gateway/userGateway";

export class UsuarioRepository implements IuserRepository {
    constructor(private readonly pool: Pool){

    }
    async save(nome: string, telefone: string, endereco?: string): Promise<void>{
        if(!nome){
            console.error("[SAVE USUARIO REPOSITORY] Não se pode salvar usuário com nome nulo");
            throw new Error("Nome é obrigatório");
        }
        if(!telefone){
            console.error("[SAVE USUARIO REPOSITORY] Não se pode salvar usuário com telefone nulo");
            throw new Error("[SAVE USUARIO REPOSITORY] Número é obrigatório");
            return;
        }
        try{
            const query = await this.pool.query("INSERT INTO usuarios (nome, telefone, endereco) VALUES ($1, $2, $3)", [nome, telefone, endereco ?? null]);

        }catch(error: any){
            console.log("[SAVE USUARIO REPOSITORY] Não foi possível salvar usuario no banco de dados", error.message);
            throw error;
        }
    }

    async findByPhoneNumber(phoneNumber: string): Promise<Usuario|null>{
        if(!phoneNumber) {
            console.error("[FIND BY PHONE NUMBER USUARIO REPOSITORY] Não se pode buscar usuário com telefone nulo");
            throw new Error("Nome é obrigatório");
        }
        

        try{
            const userDb = await this.pool.query("SELECT * FROM usuarios WHERE telefone = $1", [phoneNumber]);

            if (!userDb){
                return null
            }

            const user = userDb.rows[0]
            return Usuario.restore(user.nome, user.telefone, user.endereco, user.created_at, user.updatedAt)
            

        }catch (error) {
            console.error("[FIND BY PHONE NUMBER USUARIO REPOSITORY] Erro ao buscar usuário:", error);
            throw error;
          }
    }
}