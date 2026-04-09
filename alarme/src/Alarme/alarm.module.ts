import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './Alarme';
import { Machine } from 'src/Machine/Machine';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm, Machine])],
  providers: [AlarmService],
  controllers: [AlarmController],
  exports: [AlarmService],
})
export class AlarmModule {}
