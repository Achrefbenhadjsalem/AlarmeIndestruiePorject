import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AlarmService } from './alarm.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';

@ApiTags('alarms')
@Controller('alarms')
export class AlarmController {
  constructor(private readonly service: AlarmService) {}

  @Post()
  @ApiOperation({ summary: 'Create an alarm' })
  @ApiQuery({ name: 'machineId', required: true, type: Number, description: 'Associated machine id' })
  create(
    @Query('machineId', ParseIntPipe) machineId: number,
    @Body() dto: CreateAlarmDto,
  ) {
    return this.service.create(dto, machineId);
  }

  @Get('active')
  @ApiOperation({ summary: 'List active alarms' })
  @ApiResponse({ status: 200, description: 'List of all active alarms' })
  findActive() {
    return this.service.findActive();
  }

  @Get('inactive')
  @ApiOperation({ summary: 'List inactive alarms' })
  @ApiResponse({ status: 200, description: 'List of all inactive alarms' })
  findInactive() {
    return this.service.findInactive();
  }

  @Get()
  @ApiOperation({ summary: 'List alarms' })
  findAll() {
    return this.service.findAll();
  }

  @Get('machine/:machineId')
  @ApiOperation({ summary: "List alarms for a machine" })
  @ApiResponse({ status: 200, description: 'List of alarms for the machine' })
  findByMachine(@Param('machineId', ParseIntPipe) machineId: number) {
    return this.service.findByMachine(machineId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an alarm by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  @Get('machine/:machineId/active')
  @ApiOperation({ summary: "List active alarms for a specific machine" })
  @ApiResponse({ status: 200, description: 'List of active alarms for the machine' })
  findActiveByMachine(@Param('machineId', ParseIntPipe) machineId: number) {
    return this.service.findActiveByMachine(machineId);
  }

  @Get('machine/:machineId/inactive')
  @ApiOperation({ summary: "List inactive alarms for a specific machine" })
  @ApiResponse({ status: 200, description: 'List of inactive alarms for the machine' })
  findInactiveByMachine(@Param('machineId', ParseIntPipe) machineId: number) {
    return this.service.findInactiveByMachine(machineId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an alarm' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAlarmDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an alarm' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
