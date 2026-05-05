import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
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

    async solicitarRecuperacaoSenha(email: string): Promise<void> {
        const usuario = await this.usuariosService.buscarPorEmail(email);
        if (!usuario) {
            // Retorna sem erro para não expor quais e-mails estão cadastrados
            return;
        }

        const token = randomBytes(32).toString('hex');
        const expiracao = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await this.usuariosService.salvarCodigoRecuperacao(usuario.id, token, expiracao);
        await this.emailService.enviarLinkRecuperacao(email, token);
    }

    async redefinirSenha(token: string, novaSenha: string): Promise<void> {
        const usuario = await this.usuariosService.buscarPorCodigoRecuperacao(token);
        if (!usuario) {
            throw new NotFoundException('Token inválido');
        }

        if (!usuario.codigoRecuperacaoExpiracao || usuario.codigoRecuperacaoExpiracao < new Date()) {
            throw new BadRequestException('Token expirado');
        }

        await this.usuariosService.atualizarSenha(usuario.id, novaSenha);
    }
}
