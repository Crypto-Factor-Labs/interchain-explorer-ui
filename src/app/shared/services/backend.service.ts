import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../config.service';
import { PricePoint } from '../interfaces/statistics.interface';
import {
  TxDto, TxExecutionPartDto, TxListDto,
  Tx, TxExecutionPart, TxFetchResult,
} from '../interfaces/transaction.interface';

// TEMPORARY workaround for BN to decimal conversion
// until the relevant properities have been added to the entities in the backend.
import BN from 'bn.js';

const hexToDec = (v: string | null | undefined): string | null =>
  v && v.trim() ? new BN(v.trim().replace(/^0x/i, ''), 16).toString(10) : null;

@Injectable({
  providedIn: 'root'  // Makes the BackendService available throughout the application,
})                    // no need to specify it explicitly as provider in other modules.
export class BackendService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    // URL to the API of the INTERCHAIN Explorer backend
    this.apiUrl = `${this.config.appBaseUrl}/api`;
  }

  /*
   * Methods to retrieve indexed MasterBlocks (i.e. blocks from the MasterChain) 
   */
  getMasterBlock(hash: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/masterchain/block?height_or_hash=${hash}`);
  }

  getLatestMasterBlock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/masterchain/latest-block`);
  }

  getMasterBlocks(nr: number, skip?: number, includePartialBlocks?: boolean): Observable<any> {

    let params = new HttpParams().set('nr', nr.toString());

    // If `skip` is provided, add it to the params
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }

    // If `includePartialBlocks` is provided, add it to the params
    if (includePartialBlocks !== undefined) {
      params = params.set('includePartialBlocks', includePartialBlocks.toString());
    }

    // Make the GET request with the modified params
    return this.http.get(`${this.apiUrl}/masterchain/blocks`, { params });
  }

  /*
   * Methods to retrieve indexed PartialBlocks (i.e. blocks from the PartialChains)
   */
  getPartialBlock(hash: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/partialchain/block?hash=${hash}`);
  }

  /*
   * Methods to retrieve Transactions
   */
  getTransactions(nr: number, skip = 0, includeParts = false): Observable<TxFetchResult> {
    const params = new HttpParams()
      .set('nr', String(nr))
      .set('skip', String(skip))
      .set('includeParts', String(includeParts));

    // Also the `sender` and `operator` parameters can be added if needed
    // params = params.set('sender', sender).set('operator', operator);

    // Make the GET request with the modified params
    // returns: { total, items: [...] }
    return this.http.get<TxListDto>(`${this.apiUrl}/masterchain/transactions`, { params }).pipe(
      map(dto => ({
        total: dto.total,
        transactions: dto.items.map(this.mapTx),
      }))
    );
  }

  private mapTx = (dto: TxDto): Tx => ({
    tx_hash: dto.transactionHash,
    timestamp: dto.timestamp ?? null,
    state: dto.state,
    chainId: dto.sourceChainId,
    includedInMasterBlock: dto.includedInMasterBlock ?? '',
    masterBlockHeight: hexToDec(dto.masterBlockHeight) ?? null,  // TEMPORARY workaround for BN to decimal conversion
    masterBlockTxIndex: dto.masterBlockTxIndex ?? null,
    executionParts: (dto.executionParts ?? []).map(this.mapExecPart),
  });

  private mapExecPart = (dto: TxExecutionPartDto): TxExecutionPart => ({
    hash: dto.hash,
    transactionHash: dto.transactionHash,
    partIndex: dto.partIndex ?? null,
    isRevert: dto.isRevert,
    chainId: dto.chainId ?? null,
    includedInPartialBlock: dto.includedInPartialBlock ?? null,
    partialBlockHeight: hexToDec(dto.partialBlockHeight) ?? null, // TEMPORARY workaround for BN to decimal conversion
    partialBlockPartIndex: dto.partialBlockPartIndex ?? null,
  });

  /*
   * Methods to retrieve Statistics
   */
  getStatistics(): Observable<any> {
    //console.log(">>> getStatistics")
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  getCfrPriceHistory(minutes = 60): Observable<PricePoint[]> {
    return this.http.get<PricePoint[]>(`${this.apiUrl}/statistics/cfr-price-history?minutes=${minutes}`);
  }
}
