import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Divida } from '../../dividas/entities/divida.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nome: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar' })
    senha: string;

    @OneToMany(() => Divida, (divida) => divida.usuario)
    dividas: Divida[];

    @CreateDateColumn({ type: 'timestamp' })
    criadoEm: Date;
}
