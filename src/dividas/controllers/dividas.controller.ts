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
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator';
import { DividasService } from '../services/dividas.service';

export class CreateDividaDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor: number;

  @IsInt()
  @Min(1)
  @Max(360)
  quantidadeParcelas: number;

  @IsDateString()
  dataVencimentoPrimeiraParcela: string;
}

export class UpdateDividaDto {
  @IsString()
  @IsNotEmpty()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor?: number;

  @IsInt()
  @Min(1)
  @Max(360)
  quantidadeParcelas?: number;

  @IsDateString()
  dataVencimentoPrimeiraParcela?: string;
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


