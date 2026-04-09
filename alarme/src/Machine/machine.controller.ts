import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@ApiTags('machines')
@Controller('machines')
export class MachineController {
  constructor(private readonly service: MachineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a machine' })
  @ApiResponse({ status: 201, description: 'Machine created' })
  create(@Body() dto: CreateMachineDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List machines' })
  @ApiResponse({ status: 200, description: 'List of machines' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a machine by id' })
  @ApiResponse({ status: 200, description: 'Machine found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a machine' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMachineDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a machine' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
