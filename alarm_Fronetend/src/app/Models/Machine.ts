import { Alarm } from "./Alamre";

export interface Machine {
  id: number;
  name: string;
  code: string;
  type?: string;
  location?: string;
  isActive: boolean;

  ipAddress?: string;
  protocol?: string;

  alarms?: Alarm[];

  createdAt: Date;
  updatedAt: Date;
}