import { Routes } from '@angular/router';
import { ListesDesAlarmes } from './Compoenents/listes-des-alarmes/listes-des-alarmes';
import { ListesDesMachines } from './Compoenents/listes-des-machines/listes-des-machines';

export const routes: Routes = [
  { path: '',        redirectTo: 'alarmes', pathMatch: 'full' },
  { path: 'alarmes', component: ListesDesAlarmes },
  { path: 'machines', component: ListesDesMachines },
  { path: '**',      redirectTo: 'alarmes' },
];
