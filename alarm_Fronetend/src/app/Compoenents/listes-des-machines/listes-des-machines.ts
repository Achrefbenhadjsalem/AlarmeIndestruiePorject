import { afterNextRender, ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineService } from '../../Services/machine.service';
import { Machine } from '../../Models/Machine';
import { AddNewMAchinepopup } from '../add-new-machinepopup/add-new-machinepopup';
import { EdtitMAchinePopup } from '../edtit-machine-popup/edtit-machine-popup';

@Component({
  selector: 'app-listes-des-machines',
  standalone: true,
  imports: [CommonModule, AddNewMAchinepopup, EdtitMAchinePopup],
  templateUrl: './listes-des-machines.html',
  styleUrl: './listes-des-machines.css',
})
export class ListesDesMachines implements OnInit {
  machines: Machine[] = [];
  filteredMachines: Machine[] = [];
  showAddPopup   = false;
  showEditPopup  = false;
  selectedMachine: Machine | null = null;
  isLoading = true;
  searchQuery = '';
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

 constructor(private machineService: MachineService) {
  // remove afterNextRender block entirely
}

  ngOnInit(): void { 
    this.loadMachines();
     
  }

  get activeCount()  { return this.machines.filter(m => m.isActive).length; }
  get stoppedCount() { return this.machines.filter(m => !m.isActive).length; }

  loadMachines() {
    this.isLoading = true;
    
    this.machineService.findAll().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.machines = [...data];
          this.applyFilter();
          this.isLoading = false;
          
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Energie OS - Machine Load Error:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  applyFilter() {
    const q = this.searchQuery.toLowerCase();
    this.filteredMachines = q
      ? this.machines.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q) ||
          (m.type || '').toLowerCase().includes(q) ||
          (m.location || '').toLowerCase().includes(q)
        )
      : [...this.machines];
  }

  openAddPopup()            { this.showAddPopup = true; }
  openEditPopup(m: Machine) { this.selectedMachine = m; this.showEditPopup = true; }
  closePopups()             { this.showAddPopup = false; this.showEditPopup = false; this.selectedMachine = null; }

  onMachineAdded(data: Partial<Machine>) {
    this.machineService.create(data).subscribe({
      next: () => { this.loadMachines(); this.closePopups(); },
      error: () => {
        this.machines.push({ ...data, id: Date.now() } as Machine);
        this.applyFilter();
        this.closePopups();
      }
    });
  }

  onMachineUpdated(data: Machine) {
    this.machineService.update(data.id, data).subscribe({
      next: () => { this.loadMachines(); this.closePopups(); },
      error: () => {
        const idx = this.machines.findIndex(m => m.id === data.id);
        if (idx > -1) this.machines[idx] = data;
        this.applyFilter();
        this.closePopups();
      }
    });
  }

  deleteMachine(id: number) {
    if (!confirm('Supprimer cette machine ?')) return;
    this.machineService.remove(id).subscribe({
      next: () => this.loadMachines(),
      error: () => { this.machines = this.machines.filter(m => m.id !== id); this.applyFilter(); }
    });
  }
}
