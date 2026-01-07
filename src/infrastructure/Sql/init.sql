CREATE TABLE usuarios (
    telefone VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100),
    endereco TEXT,
    estado VARCHAR(20) DEFAULT 'CONVERSA',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_nome_usuarios ON usuarios(nome);

CREATE TABLE cardapio(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    disponivel BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_categoria_cardapio ON cardapio(categoria);
CREATE INDEX idx_disponivel_cardapio ON cardapio(disponivel);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    protocolo VARCHAR(50) UNIQUE NOT NULL,
    telefone VARCHAR(20) REFERENCES usuarios(telefone),
    itens JSONB NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    endereco TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_criado_em ON pedidos(criado_em DESC);
CREATE INDEX idx_pedidos_telefone ON pedidos(telefone);



INSERT INTO cardapio (nome, descricao, preco, categoria) VALUES
    ('Pizza Margherita', 'Molho de tomate, mussarela e manjericão fresco', 35.00, 'pizza'),
    ('Pizza Calabresa', 'Molho de tomate, mussarela e calabresa fatiada', 38.00, 'pizza'),
    ('Pizza Portuguesa', 'Presunto, ovos, cebola, azeitona e mussarela', 42.00, 'pizza'),
    ('Pizza Quatro Queijos', 'Mussarela, provolone, gorgonzola e parmesão', 45.00, 'pizza'),
    ('Refrigerante Lata', 'Coca-Cola, Guaraná ou Fanta - 350ml', 5.00, 'bebida'),
    ('Refrigerante 2L', 'Coca-Cola, Guaraná ou Fanta - 2 litros', 12.00, 'bebida'),
    ('Suco Natural', 'Laranja, Limão ou Maracujá - 500ml', 8.00, 'bebida'),
    ('Água Mineral', 'Água mineral sem gás - 500ml', 3.00, 'bebida');