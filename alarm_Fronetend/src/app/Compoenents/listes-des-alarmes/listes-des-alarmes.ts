import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlarmService } from '../../Services/alarm.service';
import { MachineService } from '../../Services/machine.service';
import { Alarm } from '../../Models/Alamre';
import { Machine } from '../../Models/Machine';
import { AlarmStatus, AlarmPriority } from '../../Models/ALames-enumes';
import { PopupAddNewAlarme } from '../popup-add-new-alarme/popup-add-new-alarme';
import { EditAlarmes } from '../edit-alarmes/edit-alarmes';

@Component({
  selector: 'app-listes-des-alarmes',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupAddNewAlarme, EditAlarmes],
  templateUrl: './listes-des-alarmes.html',
  styleUrl: './listes-des-alarmes.css',
})
export class ListesDesAlarmes implements OnInit {
  alarms: Alarm[] = [];
  filteredAlarms: Alarm[] = [];
  machines: Machine[] = [];
  isLoading = true;
  showAdd = false;
  showEdit = false;
  selectedAlarm: Alarm | null = null;
  searchQuery = '';
  selectedMachineId: number | null = null;
  filterStatus: 'all' | 'active' | 'inactive' = 'all';
currentPage = 1;
  itemsPerPage = 10;
  AlarmStatus = AlarmStatus;
  AlarmPriority = AlarmPriority;
get totalPages(): number {
    return Math.ceil(this.filteredAlarms.length / this.itemsPerPage) || 1;
  }

  get paginatedAlarms(): Alarm[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAlarms.slice(startIndex, startIndex + this.itemsPerPage);
  }
  constructor(
    private alarmService: AlarmService,
    private machineService: MachineService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadAlarms();
    this.loadMachines();
  }

  /* ── Stats ── */
  get newCount() { return this.alarms.filter(a => a.status === AlarmStatus.NEW).length; }
  get criticalCount() { return this.alarms.filter(a => a.priority === AlarmPriority.CRITICAL).length; }
  get activeCount() { return this.alarms.filter(a => a.isActive).length; }

  /* ── Data Load ── */
  loadAlarms() {
    this.isLoading = true;

    // Determine the correct service call based on Machine + Status combination
    let obs$;
    const mId = this.selectedMachineId;
    const st = this.filterStatus;

    if (mId === null) {
      if (st === 'active') obs$ = this.alarmService.findActive();
      else if (st === 'inactive') obs$ = this.alarmService.findInactive();
      else obs$ = this.alarmService.findAll();
    } else {
      if (st === 'active') obs$ = this.alarmService.findActiveByMachine(mId);
      else if (st === 'inactive') obs$ = this.alarmService.findInactiveByMachine(mId);
      else obs$ = this.alarmService.findByMachine(mId);
    }
    
    obs$.subscribe({
      next: (data) => {
        // Envelopper dans un setTimeout force Angular à exécuter un cycle de détection des changements (macro-task)
        setTimeout(() => {
          this.alarms = [...data].sort((a, b) => {
            const dateA = a.triggeredAt ? new Date(a.triggeredAt).getTime() : 0;
            const dateB = b.triggeredAt ? new Date(b.triggeredAt).getTime() : 0;
            
            // 1. Tri principal : par date décroissante
            if (dateB !== dateA) {
              return dateB - dateA;
            }
            
            // 2. 🛑 CORRECTIF : Tri secondaire par ID. 
            // Si les dates sont identiques, on trie par ID décroissant. 
            // Cela empêche les alarmes de sauter et de changer de place après l'acquittement.
            return b.id - a.id; 
          });
          
          this.applyFilter();
          this.isLoading = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Error loading alarms:', err);
          this.alarms = [];
          this.applyFilter();
          this.isLoading = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      }
    });
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.markForCheck();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.markForCheck();
    }
  }

  loadMachines() {
  this.machineService.findAll().subscribe({
    next: (data) => {
      this.machines = [...data];       // new array reference
      this.cdr.detectChanges();        // force the select to re-render
    },
    error: () => {}
  });
}

  /* ── Search ── */
  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  onFilterChange() {
  this.loadAlarms();
}

  applyFilter() {
  const q = this.searchQuery.toLowerCase();

  this.filteredAlarms = this.alarms.filter(a => {
    const matchesSearch = !q || (
      (a.code     || '').toLowerCase().includes(q) ||
      (a.message  || '').toLowerCase().includes(q) ||
      (a.status   || '').toLowerCase().includes(q) ||
      (a.priority || '').toLowerCase().includes(q) ||
      (a.machine?.name || '').toLowerCase().includes(q)
    );

    const aMachineId = a.machine?.id ?? a.machine_id;
    const matchesMachine =
      this.selectedMachineId === null ||
      Number(aMachineId) === Number(this.selectedMachineId);

    const matchesStatus =
      this.filterStatus === 'all' ||
      (this.filterStatus === 'active'   && a.isActive === true)  ||
      (this.filterStatus === 'inactive' && a.isActive === false);

    return matchesSearch && matchesMachine && matchesStatus;
  });
this.currentPage = 1;
  this.cdr.markForCheck();
}

  /* ── Popup Controls ── */
  openAdd() { this.showAdd = true; }
  openEdit(a: Alarm) { this.selectedAlarm = a; this.showEdit = true; }
  closePops() { this.showAdd = false; this.showEdit = false; this.selectedAlarm = null; }

  onAlarmAdded(payload: { machineId: number; alarm: Partial<Alarm> }) {
    this.alarmService.create(payload.machineId, payload.alarm).subscribe({
      next: () => { 
        this.closePops(); 
        window.location.reload(); // 🔄 Force le rafraîchissement de la page
      },
      error: () => {
        this.alarms.unshift({ ...payload.alarm, id: Date.now() } as Alarm);
        this.applyFilter();
        this.closePops();
      }
    });
  }

  onAlarmUpdated(updated: Alarm) {
    this.alarmService.update(updated.id, updated).subscribe({
      next: () => { 
        this.closePops(); 
        window.location.reload(); // 🔄 Force le rafraîchissement de la page
      },
      error: () => {
        const idx = this.alarms.findIndex(a => a.id === updated.id);
        if (idx > -1) this.alarms[idx] = updated;
        this.applyFilter();
        this.closePops();
      }
    });
  }
  acknowledgeAlarm(alarm: Alarm) {
    if (!confirm('Voulez-vous vraiment acquitter (désactiver) cette alarme ?')) return;

    // Créer une copie de l'alarme avec le statut modifié
    const updatedAlarm = { ...alarm, isActive: false, status: AlarmStatus.VIEWED };

    this.alarmService.update(alarm.id, updatedAlarm).subscribe({
      next: () => {
        window.location.reload(); // 🔄 Force le rafraîchissement
      },
      error: (err) => {
        console.error("Erreur lors de l'acquittement", err);
        // Mise à jour locale (optimiste) en cas d'erreur ou d'absence de backend réel
        const idx = this.alarms.findIndex(a => a.id === alarm.id);
        if (idx > -1) {
          this.alarms[idx] = updatedAlarm;
          this.applyFilter();
        }
      }
    });
  }
  deleteAlarm(id: number) {
    if (!confirm('Supprimer cette alarme ?')) return;
    this.alarmService.remove(id).subscribe({
      next: () => { 
        window.location.reload(); // 🔄 Force le rafraîchissement de la page
      },
      error: () => { 
        this.alarms = this.alarms.filter(a => a.id !== id); 
        this.applyFilter(); 
      }
    });
  }

  /* ── Helpers ── */
  getMachineName(alarm: Alarm): string {
    if (alarm.machine?.name) return alarm.machine.name;
    const m = this.machines.find(m => m.id === alarm.machine_id);
    return m ? m.name : '—';
  }

  getMachineCode(alarm: Alarm): string {
    if (alarm.machine?.code) return alarm.machine.code;
    const m = this.machines.find(m => m.id === alarm.machine_id);
    return m ? m.code : '';
  }

  timeSince(date: Date): string {
    const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (secs < 60) return `${secs}s`;
    if (secs < 3600) return `${Math.floor(secs / 60)}min`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h`;
    return `${Math.floor(secs / 86400)}j`;
  }
}