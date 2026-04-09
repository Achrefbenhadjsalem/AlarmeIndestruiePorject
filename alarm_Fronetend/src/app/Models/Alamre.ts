import { AlarmPriority, AlarmStatus } from "./ALames-enumes";
import { Machine } from "./Machine";

export interface Alarm {
  id: number;

  code: string;
  message?: string;

  status: AlarmStatus;
  priority: AlarmPriority;

  isActive: boolean;

  triggeredAt: Date;
  viewedAt?: Date;
  resetAt?: Date;

  machine_id?: number;
  machine?: Machine;

  createdAt: Date;
  updatedAt: Date;
}