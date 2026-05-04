import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDividaDto, UpdateDividaDto } from '../controllers/dividas.controller';
import { Divida } from '../entities/divida.entity';

@Injectable()
export class DividasService {
  constructor(
    @InjectRepository(Divida)
    private readonly dividaRepository: Repository<Divida>,
  ) { }

  async create(createDividaDto: CreateDividaDto, usuarioId: number): Promise<Divida> {
    const divida = this.dividaRepository.create({
      ...createDividaDto,
      usuario: { id: usuarioId },
    });
    return this.dividaRepository.save(divida);
  }

  async findAll(usuarioId: number): Promise<Divida[]> {
    return this.dividaRepository.find({
      where: { usuario: { id: usuarioId } },
      order: { criadoEm: 'DESC' },
    });
  }

  async findOne(id: number, usuarioId: number): Promise<Divida> {
    const divida = await this.dividaRepository.findOne({
      where: { id, usuario: { id: usuarioId } },
    });
    if (!divida) {
      throw new NotFoundException(`Dívida com id ${id} não encontrada`);
    }
    return divida;
  }

  async update(id: number, updateDividaDto: UpdateDividaDto, usuarioId: number): Promise<Divida> {
    const divida = await this.findOne(id, usuarioId);
    Object.assign(divida, updateDividaDto);
    return this.dividaRepository.save(divida);
  }

  async remove(id: number, usuarioId: number): Promise<void> {
    const divida = await this.findOne(id, usuarioId);
    await this.dividaRepository.remove(divida);
  }
}

