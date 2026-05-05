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

@Entity('dividas')
export class Divida {
    @ApiProperty({ example: 1, description: 'ID da dívida' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Financiamento do carro', description: 'Descrição da dívida', maxLength: 255 })
    @Column({ type: 'varchar', length: 255 })
    descricao: string;

    @ApiProperty({ example: 1500.00, description: 'Valor total da dívida' })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor: number;

    @ApiProperty({ example: 12, description: 'Quantidade de parcelas' })
    @Column({ type: 'int' })
    quantidadeParcelas: number;

    @ApiProperty({ example: '2026-05-04', description: 'Data de vencimento da primeira parcela (YYYY-MM-DD)' })
    @Column({ type: 'date' })
    dataVencimentoPrimeiraParcela: string;

    @ApiProperty({ example: 'Maria Silva', description: 'Nome do titular do cartão ou pessoa responsável pela dívida', maxLength: 100, nullable: true })
    @Column({ type: 'varchar', length: 100, nullable: true })
    nomeTitular: string | null;

    @ApiProperty({ type: () => Usuario, description: 'Usuário dono da dívida' })
    @ManyToOne(() => Usuario, (usuario) => usuario.dividas, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @ApiProperty({ example: '2026-05-04T00:00:00.000Z', description: 'Data de criação da dívida' })
    @CreateDateColumn({ type: 'timestamp' })
    criadoEm: Date;

    @ApiProperty({ example: '2026-05-04T00:00:00.000Z', description: 'Data da última atualização da dívida' })
    @UpdateDateColumn({ type: 'timestamp' })
    atualizadoEm: Date;
}
