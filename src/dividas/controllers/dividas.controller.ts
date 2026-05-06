import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';
import { DividasService } from '../services/dividas.service';
import { BandeiraCartao } from '../entities/divida.entity';

export class CreateDividaDto {
  @ApiProperty({ example: 'Financiamento do carro', description: 'Descrição da dívida', minLength: 1, maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @ApiProperty({ example: 1500.00, description: 'Valor total da dívida (maior que 0)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor: number;

  @ApiProperty({ example: 12, description: 'Quantidade de parcelas (mínimo 1, máximo 360)' })
  @IsInt()
  @Min(1)
  @Max(360)
  quantidadeParcelas: number;

  @ApiProperty({ example: '2026-05-04', description: 'Data de vencimento da primeira parcela (YYYY-MM-DD)' })
  @IsDateString()
  dataVencimentoPrimeiraParcela: string;

  @ApiProperty({ example: 'Maria Silva', description: 'Nome do titular do cartão ou responsável pela dívida (opcional)', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeTitular?: string;

  @ApiProperty({ enum: BandeiraCartao, example: BandeiraCartao.NUBANK, description: 'Bandeira/banco do cartão (opcional)', required: false })
  @IsOptional()
  @IsEnum(BandeiraCartao)
  bandeira?: BandeiraCartao;
}

export class UpdateDividaDto {
  @ApiProperty({ example: 'Financiamento do carro', description: 'Descrição da dívida', required: false, maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao?: string;

  @ApiProperty({ example: 1500.00, description: 'Valor total da dívida (maior que 0)', required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor?: number;

  @ApiProperty({ example: 12, description: 'Quantidade de parcelas (mínimo 1, máximo 360)', required: false })
  @IsInt()
  @Min(1)
  @Max(360)
  quantidadeParcelas?: number;

  @ApiProperty({ example: '2026-05-04', description: 'Data de vencimento da primeira parcela (YYYY-MM-DD)', required: false })
  @IsDateString()
  dataVencimentoPrimeiraParcela?: string;

  @ApiProperty({ example: 'Maria Silva', description: 'Nome do titular do cartão ou responsável pela dívida', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeTitular?: string;

  @ApiProperty({ enum: BandeiraCartao, example: BandeiraCartao.NUBANK, description: 'Bandeira/banco do cartão', required: false })
  @IsOptional()
  @IsEnum(BandeiraCartao)
  bandeira?: BandeiraCartao;

  @ApiProperty({ example: true, description: 'Marcar dívida como paga neste mês', required: false })
  @IsOptional()
  @IsBoolean()
  pago?: boolean;
}

@UseGuards(AuthGuard('jwt'))
@Controller('dividas')
export class DividasController {
  constructor(private readonly dividasService: DividasService) {}

  @Post()
  create(@Body() createDividaDto: CreateDividaDto, @Request() req) {
    return this.dividasService.create(createDividaDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.dividasService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.dividasService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDividaDto: UpdateDividaDto,
    @Request() req,
  ) {
    return this.dividasService.update(id, updateDividaDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.dividasService.remove(id, req.user.id);
  }
}


