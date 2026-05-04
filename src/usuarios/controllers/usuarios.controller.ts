import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UsuariosService } from '../services/usuarios.service';

export class CriarUsuarioDto {
    @ApiProperty({ example: 'João Silva', description: 'Nome do usuário', minLength: 2, maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nome: string;

    @ApiProperty({ example: 'joao@email.com', description: 'E-mail válido do usuário', maxLength: 150 })
    @IsEmail()
    @MaxLength(150)
    email: string;

    @ApiProperty({ example: '123456', description: 'Senha com no mínimo 6 e no máximo 20 caracteres', minLength: 6, maxLength: 20 })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    senha: string;
}

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post('registrar')
    registrar(@Body() body: CriarUsuarioDto) {
        return this.usuariosService.criar(body.nome, body.email, body.senha);
    }
}
