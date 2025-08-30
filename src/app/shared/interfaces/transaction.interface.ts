/**
 * Conventions:
 * - All height-like fields are decimal strings (already hex→dec at ingest).
 * - All timestamps are milliseconds.
 * - TriState: 0=pending, 1=success, 2=failed/rollback.
 */

export type TriState = 0 | 1 | 2;
export type ExecResult = TriState;
export type ValidationResult = TriState;

/** Generic chain event (block/tx/event level data). */
export interface ChainEvent {
  // Block-level
  blockHash: string;
  blockHeight: string;        // decimal string
  blockTimestamp: number;     // ms
  blockSubchain?: string;

  // Transaction-level (optional)
  transactionHash?: string;
  transactionReceiver?: string;
  transactionSender?: string;
  transactionSubchain?: string;
  transactionData?: string;

  // Event-level
  eventHash?: string;
  eventTimestamp?: number;    // ms
  eventBlock?: string;
  eventBlockHeight?: string;  // decimal string
  eventReceiver?: string;
  eventSender?: string;
  eventSubchain?: string;
  eventData?: string;

  // Optional metadata
  type?: number;
  encodableType?: number;
}

export interface ChainEventWithResult extends ChainEvent {
  result: ExecResult; // 0=pending, 1=success, 2=failed
}

/** Base execution-part metadata common to all parts. */
export interface ExecutionPartBase {
  format: number;
  version: number;
  transactionExecutionPartIndex: number; // aka transactionPartIndex
  transactionHash: string;
  chainId: number;
  executionSignature: string;
  hash: string;
  operatorAddress: string;
  senderAddress: string;
  includedInPartialBlock: string;
  partialBlockPartIndex: number;
  txnType?: number;
}

/** Full execution-part with events and optional proofs. */
export interface ExecutionPart extends ExecutionPartBase {
  // Scheduling / publish events (no result)
  targetChainSchedulingEvent?: ChainEvent;
  targetChainPublishEvent?: ChainEvent;

  // Actual execution event (with result)
  targetChainExecutionEvent?: ChainEventWithResult;

  // Mempool proofs (optional)
  mempoolEpochCommitEvent?: ChainEvent;
  mempoolEpochConsensusProof?: string;
  mempoolEpochEVMProof?: string;
}

/** Top-level transaction returned by backend. */
export interface Transaction {
  version: number;
  format: number;
  transactionHash: string;
  nonce: string;
  sourceSender: string;
  sourceChainId: number;
  sourceChainMempoolEpoch: number;
  stateValidator: string;

  executionParts: ExecutionPart[];
  revertExecutionPart?: ExecutionPart;

  state: TriState; // validation state
  includedInMasterBlock: string;
  masterBlockHeight: string; // decimal string
  masterBlockTransactionIndex: number;

  // Events for linking/inspection
  sourceChainPushEvent?: ChainEvent;
  stateValidationEvent?: ChainEventWithResult;

  // Overall tx result/status
  result: TriState;
  encodableType: number;
}

// Interfaces for transaction list response
export interface Tx {
  tx_hash: string;
  timestamp?: number | null;
  includedInMasterBlock: string;
  masterBlockHeight?: string | null;
  masterBlockTransactionIndex?: number | null;
  state: number;
  chainId: number;
  executionParts?: TxExecutionPart[];
}

export interface TxExecutionPart {
  hash: string;
  transactionHash: string;
  isRevert: boolean;
  chainId?: number | null;
  includedInPartialBlock?: string | null;
  partIndex?: number | null; // null for revert
}

export interface TxFetchResult {
  total: number;
  transactions: Tx[];
}

// DTO interfaces for API responses
export interface TxDto {
  id: string;
  transactionHash: string;
  includedInMasterBlock: string;
  masterBlockHeight: string | null;
  masterBlockTransactionIndex: number | null;
  sourceSender: string;
  sourceChainId: number;
  state: number;
  result: any;
  timestamp?: number;
  executionParts?: TxExecutionPartDto[];
}

export interface TxExecutionPartDto {
  hash: string;
  transactionHash: string;
  isRevert: boolean;
  chainId?: number | null;
  includedInPartialBlock?: string | null;
  partIndex?: number | null; // null for revert
}
export interface TxListDto {
  total: number;
  items: TxDto[];
}

