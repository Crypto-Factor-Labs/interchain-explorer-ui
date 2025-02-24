import { Routes } from '@angular/router';
import { MasterBlocksComponent } from './masterblocks/masterblocks.component';
import { MasterBlockComponent } from './masterblock/masterblock.component';

export const routes: Routes = [
  { path: 'masterblocks', component: MasterBlocksComponent },
  { path: 'masterblock', component: MasterBlockComponent },
  { path: '', redirectTo: '/masterblocks', pathMatch: 'full' }  // Default redirect to masterblocks
];
