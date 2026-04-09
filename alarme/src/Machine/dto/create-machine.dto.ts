import { IsString, IsOptional, IsBoolean, IsIP } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMachineDto {
  @ApiProperty({ example: 'Main Motor' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'MOTOR_01' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Siemens S7-1500' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Factory A' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '192.168.1.10' })
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'S7' })
  @IsOptional()
  @IsString()
  protocol?: string;
}
