import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alarm } from '../../Models/Alamre';
import { AlarmStatus, AlarmPriority } from '../../Models/ALames-enumes';

@Component({
  selector: 'app-edit-alarmes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-alarmes.html',
  styleUrl: './edit-alarmes.css',
})
export class EditAlarmes implements OnChanges {
  @Input() alarm!: Alarm;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<Alarm>();

  edited!: Alarm;

  AlarmStatus   = AlarmStatus;
  AlarmPriority = AlarmPriority;

  statusOptions   = Object.values(AlarmStatus);
  priorityOptions = Object.values(AlarmPriority);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alarm']?.currentValue) {
      this.edited = { ...this.alarm };
    }
  }

  onSave() {
    if (!this.edited.code) { alert('Le code alarme est requis.'); return; }
    this.save.emit(this.edited);
  }

  onClose() { this.close.emit(); }
}
