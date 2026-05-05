import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) { }

    async criar(nome: string, email: string, senha: string): Promise<Omit<Usuario, 'senha'>> {
        const existe = await this.usuarioRepository.findOneBy({ email });
        if (existe) {
            throw new ConflictException('Email já cadastrado');
        }

        const hash = await bcrypt.hash(senha, 10);
        const usuario = this.usuarioRepository.create({ nome, email, senha: hash });
        const salvo = await this.usuarioRepository.save(usuario);

        const { senha: _, ...resultado } = salvo;
        return resultado;
    }

    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOneBy({ email });
    }

    async buscarPorWhatsapp(whatsapp: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOneBy({ whatsapp });
    }

    async salvarCodigoRecuperacao(id: number, codigo: string, expiracao: Date): Promise<void> {
        await this.usuarioRepository.update(id, {
            codigoRecuperacao: codigo,
            codigoRecuperacaoExpiracao: expiracao,
        });
    }

    async buscarPorCodigoRecuperacao(codigo: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOneBy({ codigoRecuperacao: codigo });
    }

    async atualizarSenha(id: number, novaSenha: string): Promise<void> {
        const hash = await bcrypt.hash(novaSenha, 10);
        await this.usuarioRepository.update(id, {
            senha: hash,
            codigoRecuperacao: null,
            codigoRecuperacaoExpiracao: null,
        });
    }
}
