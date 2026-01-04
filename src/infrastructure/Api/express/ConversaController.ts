import { pool } from "../../../config/postgresConfig";
import { Request, Response } from "express";
import { ApiResponse, Conversa } from "../../../infrastructure/types/indexTypes";


interface SalvarConversaBody {
  telefone: string;
  mensagem: string;
  resposta?: string;
  tipo?: string;
}

export class ConversaController {
  async salvar(req: Request<{}, {}, SalvarConversaBody>, res: Response): Promise<void> {
    try {
      const { telefone, mensagem, resposta, tipo } = req.body;

      await pool.query(
        `INSERT INTO conversas (telefone, mensagem, resposta, tipo) 
         VALUES ($1, $2, $3, $4)`,
        [telefone, mensagem, resposta, tipo]
      );

      const response: ApiResponse = {
        sucesso: true,
        mensagem: "Conversa salva",
      };

      res.json(response);
    } catch (error) {
      console.error("Erro ao salvar conversa:", error);
      
      const response: ApiResponse = {
        sucesso: false,
        erro: "Erro ao salvar conversa",
      };

      res.status(500).json(response);
    }
  }

  async historico(req: Request, res: Response): Promise<void> {
    try {
      const { telefone } = req.params;
      const limite = parseInt(req.query.limite as string) || 50;

      const result = await pool.query<Conversa>(
        `SELECT * FROM conversas 
         WHERE telefone = $1 
         ORDER BY criado_em DESC 
         LIMIT $2`,
        [telefone, limite]
      );

      const response: ApiResponse<Conversa[]> = {
        sucesso: true,
        dados: result.rows,
      };

      res.json(response);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      
      const response: ApiResponse = {
        sucesso: false,
        erro: "Erro ao buscar histórico",
      };

      res.status(500).json(response);
    }
  }
}