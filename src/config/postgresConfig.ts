import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_CONFIG
});

pool.on('connect', () => {
    console.log('Conexão com PostgreSQL estabelecida');
});

pool.on('error', (err) => {
    console.error(' Erro no pool do PostgreSQL:', err);
});

export async function testarConexao() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log(' Horário do banco:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('Erro ao testar conexão:', error);
        return false;
    }
}