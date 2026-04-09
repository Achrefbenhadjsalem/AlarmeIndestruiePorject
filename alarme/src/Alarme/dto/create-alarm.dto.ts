import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlarmStatus, AlarmPriority } from '../Alarme';

export class CreateAlarmDto {
  @ApiProperty({ example: 'ALARM_01' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Overcurrent detected' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ enum: AlarmStatus, example: AlarmStatus.NEW })
  @IsOptional()
  @IsEnum(AlarmStatus)
  status?: AlarmStatus;

  @ApiPropertyOptional({ enum: AlarmPriority, example: AlarmPriority.MEDIUM })
  @IsOptional()
  @IsEnum(AlarmPriority)
  priority?: AlarmPriority;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2024-01-01T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  triggeredAt?: string;

  // `machineId` is provided as a request parameter (query/path) and
  // not in the request body for POST /alarms.
}
