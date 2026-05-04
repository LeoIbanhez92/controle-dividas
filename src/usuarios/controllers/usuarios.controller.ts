import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UsuariosService } from '../services/usuarios.service';

export class CriarUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
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
