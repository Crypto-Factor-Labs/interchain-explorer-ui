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
}

export interface Statistics {
  cfrPriceUSD: string;
  cfrTvlUSD: string;
  avgBlockSpeed_24hr: string;
  avgBlockSpeed_30d: string;
}
