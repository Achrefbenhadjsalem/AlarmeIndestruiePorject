import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alarm } from '../../Models/Alamre';
import { AlarmStatus, AlarmPriority } from '../../Models/ALames-enumes';

@Component({
  selector: 'app-popup-add-new-alarme',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup-add-new-alarme.html',
  styleUrl: './popup-add-new-alarme.css',
})
export class PopupAddNewAlarme {
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<{ machineId: number; alarm: Partial<Alarm> }>();

  AlarmStatus   = AlarmStatus;
  AlarmPriority = AlarmPriority;

  statusOptions   = Object.values(AlarmStatus);
  priorityOptions = Object.values(AlarmPriority);

  machineId = 0;

  newAlarm: Partial<Alarm> = {
    code:       '',
    message:    '',
    status:     AlarmStatus.NEW,
    priority:   AlarmPriority.MEDIUM,
    isActive:   true,
    triggeredAt: new Date(),
  };

  onSave() {
    if (!this.newAlarm.code) { alert('Le code alarme est requis.'); return; }
    this.save.emit({ machineId: this.machineId, alarm: this.newAlarm });
  }

  onClose() { this.close.emit(); }
}
