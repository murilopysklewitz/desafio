import { Usuario } from "../Entity/Usuario";

export interface IuserRepository{
    save(nome: string, telefone: string, endereco?: string): Promise<void>
    findByPhoneNumber(phoneNumber:string): Promise<Usuario|null>
 
}