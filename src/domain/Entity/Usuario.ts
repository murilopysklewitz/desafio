import { DomainException } from "../exceptions/DomainException";

export class Usuario {
    private constructor(
        private readonly nome: string,
        private readonly telefone: string,
        private endereco: string | undefined,
        private readonly createdAt: Date,
        private updatedAt: Date
    ) {}

    static create(nome: string, telefone: string): Usuario {
        if (!nome) {
            throw new DomainException("Nome não pode ser nulo");
        }

        if (!telefone) {
            throw new DomainException("Número não pode ser nulo");
        }

        const now = new Date();

        return new Usuario(
            nome,
            telefone,
            undefined,
            now,
            now
        );
    }

    static restore(
        nome: string,
        telefone: string,
        endereco: string | undefined,
        createdAt: Date,
        updatedAt: Date
    ): Usuario {
        return new Usuario(
            nome,
            telefone,
            endereco,
            createdAt,
            updatedAt
        );
    }

    changeEndereco(novoEndereco: string): void {
        if (!novoEndereco) {
            throw new DomainException("Endereço inválido");
        }

        this.endereco = novoEndereco;
        this.updatedAt = new Date();
    }

    getNome() {
        return this.nome;
    }

    getTelefone() {
        return this.telefone;
    }

    getEndereco() {
        return this.endereco;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }
}
