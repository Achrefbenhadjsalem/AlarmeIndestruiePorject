import { Machine } from 'src/Machine/Machine';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';

export enum AlarmStatus {
  NEW = 'NEW',
  VIEWED = 'VIEWED',
  RESET = 'RESET'
}

export enum AlarmPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  CRITICAL = 'CRITICAL'
}

@Entity('alarms')
export class Alarm {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  code: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Index()
  @Column({
    type: 'enum',
    enum: AlarmStatus,
    default: AlarmStatus.NEW
  })
  status: AlarmStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: AlarmPriority,
    default: AlarmPriority.LOW
  })
  priority: AlarmPriority;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  triggeredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  viewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resetAt: Date;

  // 🔗 relation avec Machine
  @ManyToOne(() => Machine, machine => machine.alarms, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  // 🕒 audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}