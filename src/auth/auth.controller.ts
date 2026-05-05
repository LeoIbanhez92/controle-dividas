import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
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
    @ApiProperty({ example: 'joao@email.com', description: 'E-mail cadastrado na conta' })
    @IsEmail()
    @MaxLength(150)
    email: string;
}

export class RedefinirSenhaDto {
    @ApiProperty({ example: 'abc123...', description: 'Token recebido no link do e-mail' })
    @IsString()
    token: string;

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
    solicitarRecuperacao(@Body() body: SolicitarRecuperacaoDto) {
        return this.authService.solicitarRecuperacaoSenha(body.email);
    }

    @Post('redefinir-senha')
    @HttpCode(HttpStatus.NO_CONTENT)
    redefinirSenha(@Body() body: RedefinirSenhaDto) {
        return this.authService.redefinirSenha(body.token, body.novaSenha);
    }
}
