import { Component, OnInit } from '@angular/core';
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

  constructor(private machineService: MachineService) {}

  ngOnInit(): void { this.loadMachines(); }

  get activeCount()  { return this.machines.filter(m => m.isActive).length; }
  get stoppedCount() { return this.machines.filter(m => !m.isActive).length; }

  loadMachines() {
    this.isLoading = true;
    this.machineService.findAll().subscribe({
      next: (data) => {
        this.machines = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        // Fallback mock data for frontend dev
        this.machines = [
          { id: 1, name: 'Extrudeuse Alpha', code: 'EXT-01', isActive: true,  type: 'Moulage',   location: 'Atelier Nord', protocol: 'Modbus TCP', ipAddress: '192.168.1.10', createdAt: new Date('2024-01-15'), updatedAt: new Date() } as Machine,
          { id: 2, name: 'Presse Hydraulique', code: 'PRS-02', isActive: false, type: 'Pression', location: 'Atelier Sud',  protocol: 'OPC UA',    ipAddress: '192.168.1.11', createdAt: new Date('2024-02-20'), updatedAt: new Date() } as Machine,
          { id: 3, name: 'Convoyeur C3', code: 'CNV-03', isActive: true,  type: 'Transport', location: 'Zone B',      protocol: 'S7',        ipAddress: '192.168.1.12', createdAt: new Date('2024-03-10'), updatedAt: new Date() } as Machine,
          { id: 4, name: 'Fours Industriels', code: 'FRN-04', isActive: true,  type: 'Chaleur',   location: 'Zone C',      protocol: 'Modbus TCP', ipAddress: '192.168.1.13', createdAt: new Date('2024-03-18'), updatedAt: new Date() } as Machine,
          { id: 5, name: 'Compresseur D5',    code: 'CMP-05', isActive: false, type: 'Pneumatique',location: 'Atelier Est', protocol: 'OPC UA',    ipAddress: '192.168.1.14', createdAt: new Date('2024-04-01'), updatedAt: new Date() } as Machine,
        ];
        this.applyFilter();
        this.isLoading = false;
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
