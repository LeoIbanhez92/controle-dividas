import { Body, Controller, Post } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.senha);
    }
}
