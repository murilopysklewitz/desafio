import type { Pool } from "pg";
import type { Request, Response } from "express";
import { pool } from "../../../config/postgresConfig";
export class CardapioController {
    constructor(private readonly pool: Pool){
    }

    async list(request:Request, response:Response) {
        try {
            const categoria = request.query;

            let query = 'SELECT * from cardapio WHERE disponivel = true';
            const params = [];

            if (categoria) {
                query += ' AND categoria = $1';
                params.push(categoria)
            }

            query += ' ORDER BY categoria , nome'

            const result = await pool.query(query, params)

            response.json({
                sucesso: true,
                total: result.rows.length,
                produtos: result.rows
            })
        } catch (error) {
            console.error("Falha ao listar cardápio", error);
            response.status(500).json({
                sucesso: false,
                erro: "Erro ao buscar cardáio"
            })
        }
    }
    
    async save(request: Request, response: Response){
        try{
            const {nome, preco, categoria, descricao} =  request.body

            const query = await pool.query("INSERT INTO cardapio (nome, preco, categoria, descricao) VALUES ($1, $2, $3, $4) RETURNING *", [nome, preco, categoria, descricao])

            return response.status(201).json(   query.rows[0]);
        }catch(error:any){
            console.error("Não foi possivel salvar item no cardápio", error.message)
        }
    }

    async delete(request:Request, response: Response){
        try{
            const { id } = request.params

            const query = await pool.query('DELETE * FROM cardapio WHERE id = $1');
            
            response.json({
                sucesso: true,
                produto: query.rows[0]
            })
        } catch (erro) {
            console.error('Erro ao deletar produto:', erro);
            response.status(500).json({
                sucesso: false,
                erro: 'Erro ao deletar produto'
            });
        }
    }

    async findById(request:Request, response:Response) {
        try {
            const { id } = request.params

            const query = await pool.query('SELECT * FROM cardapio WHERE id = $1 AND disponivel = true', [id]);

            if (query.rows.length === 0) {
                response.status(404).json({
                    sucesso: false,
                    erro: "Produto não encontrado"
                })
                return
            }
            response.json({
                sucesso: true,
                produto: query.rows[0]
            })
        } catch (erro) {
            console.error('Erro ao buscar produto:', erro);
            response.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar produto'
            });
        }
    }

    async formatarParaWhatsApp(request: Request, response: Response): Promise<void> {
        try {
            const result = await this.pool.query(
                'SELECT * FROM cardapio WHERE disponivel = true ORDER BY categoria, nome'
            );

            const categorias: Record<string, any[]> = {};

            result.rows.forEach((item) => {
                if (!categorias[item.categoria]) {
                    categorias[item.categoria] = [];
                }
                categorias[item.categoria].push(item);
            });

            let mensagem = '*CARDÁPIO*\n\n';

            Object.keys(categorias).forEach((cat) => {
                mensagem += `📌 *${cat.toUpperCase()}*\n`;
                categorias[cat].forEach((item) => {
                    mensagem += `${item.id} - ${item.nome}\n`;
                    mensagem += `   ${item.descricao}\n`;
                    mensagem += `   R$ ${parseFloat(item.preco).toFixed(2)}\n\n`;
                });
            });

            mensagem += 'Para fazer pedido, envie:\n';
            mensagem += '*pedido ID quantidade*\n';
            mensagem += 'Ex: pedido 1 2';

            response.json({
                sucesso: true,
                mensagem
            });
        } catch (error) {
            console.error('Erro ao formatar cardápio:', error);
            response.status(500).json({
                sucesso: false,
                erro: 'Erro ao formatar cardápio'
            });
        }
    }
}