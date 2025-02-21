import { Routes } from '@angular/router';
import { MasterBlockComponent } from './masterblock/masterblock.component';

export const routes: Routes = [
  { path: 'masterblock', component: MasterBlockComponent },
  { path: '', redirectTo: '/masterblock', pathMatch: 'full' }  // Default redirect to masterblock
];
