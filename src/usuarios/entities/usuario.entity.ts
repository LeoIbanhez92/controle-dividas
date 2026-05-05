import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Divida } from '../../dividas/entities/divida.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('usuarios')
export class Usuario {
    @ApiProperty({ example: 1, description: 'ID do usuário' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'João Silva', description: 'Nome do usuário', maxLength: 100 })
    @Column({ type: 'varchar', length: 100 })
    nome: string;

    @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário', maxLength: 150 })
    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @ApiProperty({ example: '123456', description: 'Senha do usuário (armazenada como hash)' })
    @Column({ type: 'varchar' })
    senha: string;

    @ApiProperty({ example: '5511999999999', description: 'Número de WhatsApp do usuário (apenas dígitos, com DDI)', maxLength: 20, nullable: true })
    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    whatsapp: string | null;

    @Column({ type: 'varchar', nullable: true })
    codigoRecuperacao: string | null;

    @Column({ type: 'timestamp', nullable: true })
    codigoRecuperacaoExpiracao: Date | null;

    @ApiProperty({ type: () => [Divida], description: 'Dívidas do usuário' })
    @OneToMany(() => Divida, (divida) => divida.usuario)
    dividas: Divida[];

    @ApiProperty({ example: '2026-05-04T00:00:00.000Z', description: 'Data de criação do usuário' })
    @CreateDateColumn({ type: 'timestamp' })
    criadoEm: Date;
}
