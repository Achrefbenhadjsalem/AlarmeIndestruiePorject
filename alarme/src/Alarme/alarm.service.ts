import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from './Alarme';
import { Machine } from 'src/Machine/Machine';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepo: Repository<Alarm>,
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
  ) {}

  async create(dto: CreateAlarmDto, machineId: number) {
    const machine = await this.machineRepo.findOne({ where: { id: machineId } });
    if (!machine) throw new NotFoundException(`Machine ${machineId} not found`);

    const alarm = this.alarmRepo.create({
      code: dto.code,
      message: dto.message,
      status: dto.status,
      priority: dto.priority,
      isActive: dto.isActive,
      triggeredAt: dto.triggeredAt ? new Date(dto.triggeredAt) : undefined,
      machine,
    } as any);

    return this.alarmRepo.save(alarm);
  }

  findAll() {
    return this.alarmRepo.find({ relations: ['machine'] });
  }

  findByMachine(machineId: number) {
    return this.alarmRepo
      .createQueryBuilder('alarm')
      .leftJoinAndSelect('alarm.machine', 'machine')
      .where('machine.id = :machineId', { machineId })
      .getMany();
  }
  findActive() {
    return this.alarmRepo.find({ 
      where: { isActive: true }, 
      relations: ['machine'] 
    });
  }
  findActiveByMachine(machineId: number) {
    return this.alarmRepo.find({
      where: { 
        isActive: true,
        machine: { id: machineId } 
      },
      relations: ['machine'],
    });
  }

  findInactiveByMachine(machineId: number) {
    return this.alarmRepo.find({
      where: { 
        isActive: false,
        machine: { id: machineId } 
      },
      relations: ['machine'],
    });
  }

  findInactive() {
    return this.alarmRepo.find({ 
      where: { isActive: false }, 
      relations: ['machine'] 
    });
  }

  async findOne(id: number) {
    const a = await this.alarmRepo.findOne({ where: { id }, relations: ['machine'] });
    if (!a) throw new NotFoundException(`Alarm ${id} not found`);
    return a;
  }

  async update(id: number, dto: UpdateAlarmDto) {
    const alarm = await this.alarmRepo.findOne({ where: { id } });
    if (!alarm) throw new NotFoundException(`Alarm ${id} not found`);

    if ((dto as any).machineId) {
      const m = await this.machineRepo.findOne({ where: { id: (dto as any).machineId } });
      if (!m) throw new NotFoundException(`Machine ${(dto as any).machineId} not found`);
      (alarm as any).machine = m;
    }

    Object.assign(alarm, dto);
    return this.alarmRepo.save(alarm);
  }

  async remove(id: number) {
    const alarm = await this.alarmRepo.findOne({ where: { id } });
    if (!alarm) throw new NotFoundException(`Alarm ${id} not found`);
    return this.alarmRepo.remove(alarm);
  }
}
