import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DividasController } from './controllers/dividas.controller';
import { DividasService } from './services/dividas.service';
import { DividasScheduler } from './services/dividas.scheduler';
import { Divida } from './entities/divida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Divida])],
  controllers: [DividasController],
  providers: [DividasService, DividasScheduler],
})
export class DividasModule {}
