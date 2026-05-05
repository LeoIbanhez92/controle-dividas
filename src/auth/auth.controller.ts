import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

export class LoginDto {
    @ApiProperty({ example: 'joao@email.com', description: 'E-mail cadastrado', maxLength: 150 })
    @IsEmail()
    @MaxLength(150)
    email: string;

    @ApiProperty({ example: '123456', description: 'Senha com no mínimo 6 e no máximo 20 caracteres', minLength: 6, maxLength: 20 })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    senha: string;
}

export class SolicitarRecuperacaoDto {
    @ApiProperty({ example: '5511999999999', description: 'Número de WhatsApp com DDI e DDD (apenas dígitos)' })
    @IsMobilePhone('pt-BR', { strictMode: false })
    whatsapp: string;
}

export class RedefinirSenhaDto {
    @ApiProperty({ example: '123456', description: 'Código de 6 dígitos recebido via WhatsApp' })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    codigo: string;

    @ApiProperty({ example: 'novaSenha123', description: 'Nova senha com no mínimo 6 e no máximo 20 caracteres', minLength: 6, maxLength: 20 })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    novaSenha: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.senha);
    }

    @Post('recuperar-senha')
    @HttpCode(HttpStatus.NO_CONTENT)
    solicitarRecuperacao(@Body() body: SolicitarRecuperacaoDto) {
        return this.authService.solicitarRecuperacaoSenha(body.whatsapp);
    }

    @Post('redefinir-senha')
    @HttpCode(HttpStatus.NO_CONTENT)
    redefinirSenha(@Body() body: RedefinirSenhaDto) {
        return this.authService.redefinirSenha(body.codigo, body.novaSenha);
    }
}
