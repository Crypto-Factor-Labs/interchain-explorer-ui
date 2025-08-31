import { Injectable, signal } from "@angular/core";

// Service to hold transaction statistics using Angular Signals.
// This allows to share reactive state (like the total number of transactions)
// across different components without the need for more complex state management.
// nrOfTx holds the total number of transactions as a signal. It is updated
// from the MasterBlocksComponent when transactions are fetched.

@Injectable({ providedIn: 'root' })
export class TxStatsService {
  readonly nrOfTx = signal(0);

  setNrOfTx(n: number) {
    this.nrOfTx.set(n);
  }
}
