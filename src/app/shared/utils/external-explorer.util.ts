import { CHAIN_EXPLORERS } from '../config/chain-explorers';

// Normalize to 0x-prefixed lowercase hex (best effort)
function normalizeHash(hash: string): string {
  const h = (hash || '').trim();
  if (!h) return '';
  return h.startsWith('0x') ? h : `0x${h}`;
}

// Build external explorer URL for a tx hash.
// Returns null if chain is unknown or hash missing.
export function buildExternalExplorerUrl(chainId: number | null | undefined, txHash: string | null | undefined): string | null {
  if (chainId == null) return null;
  const cfg = CHAIN_EXPLORERS[chainId];
  if (!cfg) return null;

  const h = normalizeHash(txHash ?? '');
  if (!h) return null;

  // Example: https://polygonscan.com/tx/0x....
  return `${cfg.baseUrl}${h}`;
}

// Get human readable name for tooltips; null if unknown
export function getExplorerName(chainId: number | null | undefined): string | null {
  const cfg = chainId != null ? CHAIN_EXPLORERS[chainId] : undefined;
  return cfg ? cfg.name : null;
}
