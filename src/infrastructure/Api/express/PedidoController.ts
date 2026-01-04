
import type { Pool } from "pg";
import type { Request, Response } from "express";
interface CriarPedidoBody {
    telefone: string;
    itens: ItemPedido[];
    endereco?: string;
  }
  export interface ItemPedido {
    id: number;
    quantidade: number;
  }
export class PedidoController {
    constructor(private readonly pool:Pool){
        this.pool = pool
    }

    async criar(req: Request, res: Response){
        try{

            const { telefone, itens, endereco} = req.body;


            if(!itens || itens.length == 0){
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Pedido deve ter ao menos 1 item'
                })
            }

            const ids = itens.map((item:ItemPedido) => item.id)

            const result = await this.pool.query(
                'SELECT id, nome, preco FROM cardapio WHERE id = ANY($1)', [ids]
            )
            let valorTotal = 0;

            const itensPedido = itens.map((item:ItemPedido) => {
                const produto = result.rows.find(p => p.id === item.id)
                if(!produto){
                    throw new Error("Produto não encontrado")
                }
                const subtotal = produto.preco * item.quantidade;
                valorTotal += subtotal;
                
                return {
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: item.quantidade,
                    subtotal
                };
            })
            const protocolo = `PED-${Date.now()}`;
            
            const insertResult = await this.pool.query(
                `INSERT INTO pedidos (protocolo, telefone, itens, valor_total, endereco) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [protocolo, telefone, JSON.stringify(itensPedido), valorTotal, endereco]
            );
            
            res.json({
                sucesso: true,
                pedido: insertResult.rows[0],
                mensagem: ` Pedido confirmado!\n\n` +
                         ` Protocolo: ${protocolo}\n` +
                         ` Total: R$ ${valorTotal.toFixed(2)}\n\n` +
                         `Seu pedido será entregue em até 45 minutos.`
            });
        }catch(error:any){
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({
                sucesso: false,
                erro: error.message || 'Erro ao criar pedido'
            });
        }
    }


    async consultar(req:Request, res: Response) {
        try {
            const { protocolo } = req.params;
            
            const result = await this.pool.query(
                'SELECT * FROM pedidos WHERE protocolo = $1',
                [protocolo]
            );
            
            if (result.rows.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Pedido não encontrado'
                });
            }
            
            const pedido = result.rows[0];
            
            const statusEmoji: Record<string, string> = {
                'pendente': '⏳',
                'preparando': '👨‍🍳',
                'saiu_entrega': '🚚',
                'entregue': '✅',
                'cancelado': '❌'
            };
            
            const mensagem= `${statusEmoji[pedido.status]} *Status do Pedido*\n\n` +
                           `📋 Protocolo: ${pedido.protocolo}\n` +
                           `📊 Status: ${pedido.status}\n` +
                           `💰 Valor: R$ ${pedido.valor_total.toFixed(2)}\n` +
                           `📅 Data: ${new Date(pedido.criado_em).toLocaleString('pt-BR')}`;
            
            res.json({
                sucesso: true,
                pedido,
                mensagem
            });
            
        } catch (error) {
            console.error('Erro ao consultar pedido:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao consultar pedido'
            });
        }
    }
}