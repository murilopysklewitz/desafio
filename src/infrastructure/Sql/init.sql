CREATE TABLE cardapio(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    disponivel BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    protocolo VARCHAR(50) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    itens JSONB NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    endereco TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversas (
    id SERIAL PRIMARY KEY,
    telefone VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    resposta TEXT,
    tipo VARCHAR(20),
    criado_em TIMESTAMP DEFAULT NOW()
);

INSERT INTO cardapio (nome, descricao, preco, categoria) VALUES
('Pizza Margherita', 'Molho, mussarela e manjericão', 35.00, 'pizza'),
('Pizza Calabresa', 'Molho, mussarela e calabresa', 38.00, 'pizza'),
('Refrigerante Lata', 'Coca-Cola, Guaraná, Fanta', 5.00, 'bebida'),
('Suco Natural', 'Laranja, Limão, Maracujá', 8.00, 'bebida');