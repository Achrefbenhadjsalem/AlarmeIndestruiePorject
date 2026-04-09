import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Machine } from '../../Models/Machine';

@Component({
  selector: 'app-edtit-machine-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edtit-machine-popup.html',
  styleUrl: './edtit-machine-popup.css',
})
export class EdtitMAchinePopup implements OnChanges {
  @Input() machine!: Machine;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Machine>();

  editedMachine!: Machine;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['machine'] && changes['machine'].currentValue) {
      // Create a shallow copy for editing
      this.editedMachine = { ...this.machine };
    }
  }

  onSave() {
    if (!this.editedMachine.name || !this.editedMachine.code) {
      alert("Le nom et le code de la machine sont requis.");
      return;
    }
    this.save.emit(this.editedMachine);
  }

  onClose() {
    this.close.emit();
  }
}
