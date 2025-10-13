import { Routes } from '@angular/router';
import { MasterBlocksComponent } from './masterblocks/masterblocks.component';
import { MasterBlockComponent } from './masterblock/masterblock.component';
import { PartialBlockComponent } from './partialblock/partialblock.component';
import { TransactionPageComponent } from './pages/transaction-page.component';

export const routes: Routes = [
  { path: 'masterblocks', component: MasterBlocksComponent },
  { path: 'masterblock', component: MasterBlockComponent },
  { path: 'partialblock', component: PartialBlockComponent },
  { path: 'tx/:hash', component: TransactionPageComponent },
  { path: '', redirectTo: '/masterblocks', pathMatch: 'full' }  // Default redirect to masterblocks
];
