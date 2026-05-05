import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('dividas_fixas')
export class DividaFixa {
    @ApiProperty({ example: 1, description: 'ID da dívida fixa' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Aluguel', description: 'Descrição da dívida fixa', maxLength: 255 })
    @Column({ type: 'varchar', length: 255 })
    descricao: string;

    @ApiProperty({ example: 'Aluguel', description: 'Tipo da dívida (ex: Aluguel, Financiamento, Assinatura, Empréstimo, Outro)', maxLength: 100 })
    @Column({ type: 'varchar', length: 100 })
    tipo: string;

    @ApiProperty({ example: 1500.00, description: 'Valor mensal da dívida fixa' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valorMensal: number;

    @ApiProperty({ example: 5, description: 'Dia do mês em que vence (1 a 31)' })
    @Column({ type: 'int' })
    diaVencimento: number;

    @ApiProperty({ example: true, description: 'Se a dívida está ativa' })
    @Column({ type: 'boolean', default: true })
    ativa: boolean;

    @ApiProperty({ type: () => Usuario, description: 'Usuário dono da dívida fixa' })
    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @ApiProperty({ example: '2026-05-05T00:00:00.000Z', description: 'Data de criação' })
    @CreateDateColumn({ type: 'timestamp' })
    criadoEm: Date;

    @ApiProperty({ example: '2026-05-05T00:00:00.000Z', description: 'Data da última atualização' })
    @UpdateDateColumn({ type: 'timestamp' })
    atualizadoEm: Date;
}
