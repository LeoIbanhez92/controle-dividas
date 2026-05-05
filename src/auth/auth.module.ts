import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { WhatsappService } from './whatsapp.service';

@Module({
    imports: [
        UsuariosModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'segredo_jwt',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, WhatsappService],
})
export class AuthModule { }
