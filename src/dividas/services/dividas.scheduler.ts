import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Divida } from '../entities/divida.entity';

@Injectable()
export class DividasScheduler {
    private readonly logger = new Logger(DividasScheduler.name);

    constructor(
        @InjectRepository(Divida)
        private readonly dividaRepository: Repository<Divida>,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deletarDividasVencidas() {
        const dividas = await this.dividaRepository.find();

        const vencidas = dividas.filter((divida) => {
            const dataFinal = new Date(divida.dataVencimentoPrimeiraParcela);
            dataFinal.setMonth(dataFinal.getMonth() + divida.quantidadeParcelas - 1);
            return dataFinal <= new Date();
        });

        if (vencidas.length > 0) {
            await this.dividaRepository.remove(vencidas);
            this.logger.log(`${vencidas.length} dívida(s) deletada(s) automaticamente por encerramento de parcelas.`);
        }
    }
}
