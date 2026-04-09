import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Machine } from '../../Models/Machine';

@Component({
  selector: 'app-add-new-machinepopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-machinepopup.html',
  styleUrl: './add-new-machinepopup.css',
})
export class AddNewMAchinepopup {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Machine>>();

  newMachine: Partial<Machine> = {
    name: '',
    code: '',
    type: '',
    location: '',
    isActive: true,
    protocol: '',
    ipAddress: ''
  };

  onSave() {
    // Basic validation
    if (!this.newMachine.name || !this.newMachine.code) {
      alert("Le nom et le code de la machine sont requis.");
      return;
    }
    this.save.emit(this.newMachine);
  }

  onClose() {
    this.close.emit();
  }
}
