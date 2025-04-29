import BN from 'bn.js'

export interface MasterChainBlock {
  block_hash: string;
  height: BN;
  timestamp: string;
  merkle_root: string;
  block_mint_transaction: string;
  indexed_at: string;
  partialBlocks: PartialChainBlock[];  // Array of PartialChainBlock data
}

export interface PartialChainBlock {
  chain_id: number;
  height: BN;
  block_hash: string;
  master_block_hash: string;
  mempool_epoch: number;
  txn_root: string;
  source_txn_hash: string;
  commit_txn_hash: string;
  commit_proof: string;
  confirmed: boolean;
  indexed_at: string;
  parentTimestamp: string;  // Timestamp of the Master Block
}

export interface Statistics {
  cfr_price_usd: string;
  cfr_tvl_usd: string;
  avg_block_speed_24hr: string;
  avg_block_speed_30d: string;
}
