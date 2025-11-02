import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../config.service';
import { PricePoint } from '../interfaces/statistics.interface.js';
import {
  TxDto, TxExecutionPartDto, TxListDto,
  Tx, TxExecutionPart, TxFetchResult,
  Transaction,
  ExecutionPart,
} from '../interfaces/transaction.interface.js';

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
  getTransaction(hash: string): Observable<Transaction> {
    const url = `${this.apiUrl}/masterchain/transaction/${encodeURIComponent(hash)}`;
    return this.http.get<any>(url).pipe(map(this.mapTransactionFull));
  }

  getTransactions(nr: number, skip = 0, includeParts = false, includeEvents = false,
    masterBlockHash?: string, sender?: string): Observable<TxFetchResult> {
    let params = new HttpParams()
      .set('nr', String(nr))
      .set('skip', String(skip))
      .set('includeParts', String(includeParts))
      .set('includeEvents', String(includeEvents));

    // Add optional parameters if provided
    if (masterBlockHash && masterBlockHash.trim()) {
      params = params.set('masterBlockHash', masterBlockHash);
    }

    if (sender && sender.trim()) {
      params = params.set('sender', sender.trim());
    }

    // Also the `operator` parameter can be added if needed
    // params = params.set('operator', operator);

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

  private mapTransactionFull = (dto: any): Transaction => ({
    version: dto.version,
    format: dto.format,
    transactionHash: dto.transactionHash,
    nonce: dto.nonce,
    sourceSender: dto.sourceSender,
    sourceChainId: dto.sourceChainId,
    sourceChainMempoolEpoch: dto.sourceChainMempoolEpoch,
    stateValidator: dto.stateValidator,
    stateValidationResult: dto.stateValidationResult,

    executionParts: Array.isArray(dto.executionParts) ? dto.executionParts.map(this.mapExecPartFull) : [],
    revertExecutionPart: dto.revertExecutionPart ? this.mapExecPartFull(dto.revertExecutionPart) : undefined,

    state: dto.state,
    includedInMasterBlock: dto.includedInMasterBlock ?? '',
    masterBlockHeight:
      hexToDec(dto.masterBlockHeight) ??
      (typeof dto.masterBlockHeight === 'number' ? String(dto.masterBlockHeight) : dto.masterBlockHeight ?? null),
    masterBlockTxIndex: dto.masterBlockTxIndex ?? null,

    // optional events (pass through if present)
    sourceChainPushEvent: dto.sourceChainPushEvent,
    stateValidationEvent: dto.stateValidationEvent,

    result: dto.result,
    encodableType: dto.encodableType,
  });

  private mapExecPartFull = (dto: any): ExecutionPart => ({
    // required (ExecutionPartBase)
    format: dto.format,
    version: dto.version,
    transactionExecutionPartIndex:
      dto.transactionExecutionPartIndex ?? dto.transactionPartIndex ?? dto.partIndex,
    transactionHash: dto.transactionHash ?? dto.tx_hash,
    chainId: dto.chainId,
    executionSignature: dto.executionSignature,
    hash: dto.hash,
    isRevert: dto.isRevert,
    operatorAddress: dto.operatorAddress,
    senderAddress: dto.senderAddress,
    includedInPartialBlock:
      dto.includedInPartialBlock ?? dto.partialBlockHash ?? dto.included_in_partial_block ?? '',
    partialBlockHeight: hexToDec(dto.partialBlockHeight) ?? "", // TEMPORARY workaround for BN to decimal conversion
    partialBlockPartIndex: dto.partialBlockPartIndex ?? dto.partIndexInPartialBlock,
    txnType: dto.txnType,

    // optional events/proofs (pass-through if present)
    targetChainSchedulingEvent: dto.targetChainSchedulingEvent,
    targetChainPublishEvent: dto.targetChainPublishEvent,
    targetChainExecutionEvent: dto.targetChainExecutionEvent,
    mempoolEpochCommitEvent: dto.mempoolEpochCommitEvent,
    mempoolEpochConsensusProof: dto.mempoolEpochConsensusProof,
    mempoolEpochEVMProof: dto.mempoolEpochEVMProof,

    // Optional: 4-step progress from backend
    events: Array.isArray(dto.events) && dto.events.length === 4 ? dto.events : undefined,
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
    // Optional: 4-step progress from backend
    events: Array.isArray(dto.events) && dto.events.length === 4 ? dto.events : undefined,
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
