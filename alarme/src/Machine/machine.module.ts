import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './Machine';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  providers: [MachineService],
  controllers: [MachineController],
  exports: [MachineService],
})
export class MachineModule {}
