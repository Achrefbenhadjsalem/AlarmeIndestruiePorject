import { Alarm } from 'src/Alarme/Alarme';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';

@Entity('machines')
export class Machine {

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 50 })
  code: string; // ex: MOTOR_01

  @Column({ nullable: true })
  type: string; 
  // Siemens S7-1500 / Omron CJ1

  @Column({ nullable: true })
  location: string;

  @Column({ default: true })
  isActive: boolean;

  // 🔌 utile pour Node-RED / WebSocket
  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  protocol: string; 
  // S7 / FINS / OPC-UA

  @OneToMany(() => Alarm, alarm => alarm.machine, {
  cascade: true
})
alarms: Alarm[];

  // 🕒 audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}