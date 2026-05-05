import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DividaFixa } from '../entities/divida-fixa.entity';
import { CreateDividaFixaDto, UpdateDividaFixaDto } from '../controllers/dividas-fixas.controller';

@Injectable()
export class DividasFixasService {
    constructor(
        @InjectRepository(DividaFixa)
        private readonly dividaFixaRepository: Repository<DividaFixa>,
    ) { }

    async create(dto: CreateDividaFixaDto, usuarioId: number): Promise<DividaFixa> {
        const dividaFixa = this.dividaFixaRepository.create({
            ...dto,
            usuario: { id: usuarioId },
        });
        return this.dividaFixaRepository.save(dividaFixa);
    }

    async findAll(usuarioId: number): Promise<DividaFixa[]> {
        return this.dividaFixaRepository.find({
            where: { usuario: { id: usuarioId } },
            order: { criadoEm: 'DESC' },
        });
    }

    async findOne(id: number, usuarioId: number): Promise<DividaFixa> {
        const dividaFixa = await this.dividaFixaRepository.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
        if (!dividaFixa) {
            throw new NotFoundException(`Dívida fixa com id ${id} não encontrada`);
        }
        return dividaFixa;
    }

    async update(id: number, dto: UpdateDividaFixaDto, usuarioId: number): Promise<DividaFixa> {
        const dividaFixa = await this.findOne(id, usuarioId);
        Object.assign(dividaFixa, dto);
        return this.dividaFixaRepository.save(dividaFixa);
    }

    async remove(id: number, usuarioId: number): Promise<void> {
        const dividaFixa = await this.findOne(id, usuarioId);
        await this.dividaFixaRepository.remove(dividaFixa);
    }
}
