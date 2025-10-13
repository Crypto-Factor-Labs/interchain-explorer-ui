import { Routes } from '@angular/router';
import { MasterBlocksComponent } from './masterblocks/masterblocks.component';
import { MasterblockModalRouteComponent } from './dialogs/routes/masterblock-modal.route';
import { PartialblockModalRouteComponent } from './dialogs/routes/partialblock-modal.route';
import { TransactionPageComponent } from './pages/transaction-page.component';

export const routes: Routes = [
  { path: 'masterblocks', component: MasterBlocksComponent },
  { path: 'tx/:hash', component: TransactionPageComponent },
  { path: 'block/:hash', outlet: 'modal', component: MasterblockModalRouteComponent },
  { path: 'pblock/:hash', outlet: 'modal', component: PartialblockModalRouteComponent },
  { path: '', redirectTo: '/masterblocks', pathMatch: 'full' }  // Default redirect to masterblocks
];
