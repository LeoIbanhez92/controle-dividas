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
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { DividasFixasService } from '../services/dividas-fixas.service';

export class CreateDividaFixaDto {
    @ApiProperty({ example: 'Aluguel apartamento', description: 'Descrição da dívida fixa', maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    descricao: string;

    @ApiProperty({ example: 'Aluguel', description: 'Tipo da dívida (ex: Aluguel, Financiamento, Assinatura, Empréstimo, Outro)', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    tipo: string;

    @ApiProperty({ example: 1500.00, description: 'Valor mensal da dívida fixa (maior que 0)' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    valorMensal: number;

    @ApiProperty({ example: 5, description: 'Dia do mês em que vence (1 a 31)' })
    @IsInt()
    @Min(1)
    @Max(31)
    diaVencimento: number;
}

export class UpdateDividaFixaDto {
    @ApiProperty({ example: 'Aluguel apartamento', description: 'Descrição da dívida fixa', required: false, maxLength: 255 })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    descricao?: string;

    @ApiProperty({ example: 'Aluguel', description: 'Tipo da dívida', required: false, maxLength: 100 })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    tipo?: string;

    @ApiProperty({ example: 1500.00, description: 'Valor mensal da dívida fixa', required: false })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    valorMensal?: number;

    @ApiProperty({ example: 5, description: 'Dia do mês em que vence (1 a 31)', required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    diaVencimento?: number;

    @ApiProperty({ example: true, description: 'Se a dívida está ativa', required: false })
    @IsOptional()
    @IsBoolean()
    ativa?: boolean;
}

@UseGuards(AuthGuard('jwt'))
@Controller('dividas-fixas')
export class DividasFixasController {
    constructor(private readonly dividasFixasService: DividasFixasService) { }

    @Post()
    create(@Body() dto: CreateDividaFixaDto, @Request() req) {
        return this.dividasFixasService.create(dto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.dividasFixasService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.dividasFixasService.findOne(id, req.user.id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDividaFixaDto,
        @Request() req,
    ) {
        return this.dividasFixasService.update(id, dto, req.user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.dividasFixasService.remove(id, req.user.id);
    }
}
