import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DividasController } from './controllers/dividas.controller';
import { DividasFixasController } from './controllers/dividas-fixas.controller';
import { Divida } from './entities/divida.entity';
import { DividaFixa } from './entities/divida-fixa.entity';
import { DividasService } from './services/dividas.service';
import { DividasFixasService } from './services/dividas-fixas.service';
import { DividasScheduler } from './services/dividas.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Divida, DividaFixa])],
  controllers: [DividasController, DividasFixasController],
  providers: [DividasService, DividasFixasService, DividasScheduler],
})
export class DividasModule {}
