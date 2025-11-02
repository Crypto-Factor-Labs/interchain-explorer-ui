import { Routes } from '@angular/router';
import { MasterBlocksComponent } from './masterblocks/masterblocks.component';
import { MasterblockModalRouteComponent } from './dialogs/routes/masterblock-modal.route';
import { PartialblockModalRouteComponent } from './dialogs/routes/partialblock-modal.route';
import { TransactionModalRouteComponent } from './dialogs/routes/transaction-modal.route';
import { TransactionPageComponent } from './pages/tx-page/tx-page.component';
import { TxsPageComponent } from './pages/txs-page/txs-page.component';

export const routes: Routes = [
  { path: 'masterblocks', component: MasterBlocksComponent },
  { path: 'tx/:hash', component: TransactionPageComponent },
  { path: 'mblock/:hash', outlet: 'modal', component: MasterblockModalRouteComponent },
  { path: 'pblock/:hash', outlet: 'modal', component: PartialblockModalRouteComponent },
  { path: 'tx/:hash', outlet: 'modal', component: TransactionModalRouteComponent },
  { path: 'txs', component: TxsPageComponent },  // optional ?sender= query param
  { path: '', redirectTo: '/masterblocks', pathMatch: 'full' }  // Default redirect to masterblocks
];
