import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './Machine';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly repo: Repository<Machine>,
  ) {}

  create(createDto: CreateMachineDto) {
    const entity = this.repo.create(createDto as any);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['alarms'] });
  }

  async findOne(id: number) {
    const m = await this.repo.findOne({ where: { id }, relations: ['alarms'] });
    if (!m) throw new NotFoundException(`Machine ${id} not found`);
    return m;
  }

  async update(id: number, updateDto: UpdateMachineDto) {
    const entity = await this.repo.preload({ id, ...(updateDto as any) });
    if (!entity) throw new NotFoundException(`Machine ${id} not found`);
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Machine ${id} not found`);
    return this.repo.remove(entity);
  }
}
