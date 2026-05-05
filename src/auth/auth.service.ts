import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
        private readonly whatsappService: WhatsappService,
    ) { }

    async login(email: string, senha: string) {
        const usuario = await this.usuariosService.buscarPorEmail(email);
        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: usuario.id, email: usuario.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async solicitarRecuperacaoSenha(whatsapp: string): Promise<void> {
        const usuario = await this.usuariosService.buscarPorWhatsapp(whatsapp);
        if (!usuario) {
            // Retorna sem erro para não expor quais números estão cadastrados
            return;
        }

        const codigo = randomInt(100000, 999999).toString();
        const expiracao = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await this.usuariosService.salvarCodigoRecuperacao(usuario.id, codigo, expiracao);
        await this.whatsappService.enviarCodigo(whatsapp, codigo);
    }

    async redefinirSenha(codigo: string, novaSenha: string): Promise<void> {
        const usuario = await this.usuariosService.buscarPorCodigoRecuperacao(codigo);
        if (!usuario) {
            throw new NotFoundException('Código inválido');
        }

        if (!usuario.codigoRecuperacaoExpiracao || usuario.codigoRecuperacaoExpiracao < new Date()) {
            throw new BadRequestException('Código expirado');
        }

        await this.usuariosService.atualizarSenha(usuario.id, novaSenha);
    }
}
