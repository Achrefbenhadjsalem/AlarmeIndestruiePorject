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
