import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('dividas')
export class Divida {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    descricao: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor: number;

    @Column({ type: 'int' })
    quantidadeParcelas: number;

    @Column({ type: 'date' })
    dataVencimentoPrimeiraParcela: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.dividas, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @CreateDateColumn({ type: 'timestamp' })
    criadoEm: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    atualizadoEm: Date;
}
