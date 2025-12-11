import { CHAIN_EXPLORERS } from '../config/chain-explorers';

// Normalize to 0x-prefixed lowercase hex (best effort)
function normalizeHex(value: string, prefixWith0x?: boolean): string {
  const v = (value || '').trim();
  if (!v) return '';
  if (prefixWith0x === false) return v;
  return v.startsWith('0x') ? v : `0x${v}`;
}

// Generic formatter for chain-specific hex values (hashes, addresses, ...)
export function formatChainHex(
  chainId: number | null | undefined,
  value: string | null | undefined
): string {
  const cfg = chainId != null ? CHAIN_EXPLORERS[chainId] : undefined;
  const prefixWith0x = cfg?.prefixWith0x;
  return normalizeHex(value ?? '', prefixWith0x);
}

// Address-specific formatter (applies “drop first 2 chars” rule)
export function formatChainAddress(
  chainId: number | null | undefined,
  address: string | null | undefined
): string {
  const cfg = chainId != null ? CHAIN_EXPLORERS[chainId] : undefined;
  let raw = (address ?? '').trim();
  if (!raw) return '';

  if (cfg?.prefixWith0x && raw.length > 2) {
    raw = raw.slice(2);
  }

  return normalizeHex(raw, cfg?.prefixWith0x);
}

// Join baseUrl + path safely (avoid double/missing slashes)
function joinUrl(base: string, path: string): string {
  if (base.endsWith('/') && path.startsWith('/')) {
    return base + path.slice(1);
  }
  if (!base.endsWith('/') && !path.startsWith('/')) {
    return `${base}/${path}`;
  }
  return base + path;
}

// Build external explorer URL for a Tx hash.
// Returns null if chain is unknown or hash missing.
export function buildExternalTxUrl(
  chainId: number | null | undefined,
  txHash: string | null | undefined
): string | null {
  if (chainId == null) return null;
  const cfg = CHAIN_EXPLORERS[chainId];
  if (!cfg) return null;

  const hash = normalizeHex(txHash ?? '', cfg.prefixWith0x);
  if (!hash) return null;

  // Example: https://polygonscan.com/tx/0x....
  return joinUrl(cfg.baseUrl, cfg.txPath) + hash;
}

// Build external explorer URL for an address.
// Returns null if chain is unknown or address missing.
export function buildExternalAddressUrl(
  chainId: number | null | undefined,
  address: string | null | undefined
): string | null {
  if (chainId == null) return null;
  const cfg = CHAIN_EXPLORERS[chainId];
  if (!cfg) return null;

  const addr = formatChainAddress(chainId, address);
  if (!addr) return null;

  // Example: https://polygonscan.com/address/0x....
  return joinUrl(cfg.baseUrl, cfg.addressPath) + addr;
}

export function buildExternalCustomUrl(
  chainId: number | null | undefined,
  custom: string | null | undefined
): string | null {
  if (chainId == null) return null;
  const cfg = CHAIN_EXPLORERS[chainId];
  if (!cfg) return null;

  const raw = (custom ?? '').trim();
  if (!raw) return null;

  // Allow full URLs to be passed straight through
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }

  // Otherwise treat as path relative to baseUrl
  return joinUrl(cfg.baseUrl, raw);
}

// Open external explorer in new tab/window (for tx)
export function openExternalTx(chainId: number, txHash: string): void {
  const url = buildExternalTxUrl(chainId, txHash);
  if (url) window.open(url, '_blank', 'noopener');
}

// Open external explorer in new tab/window (for address)
export function openExternalAddress(chainId: number, address: string): void {
  const url = buildExternalAddressUrl(chainId, address);
  if (url) window.open(url, '_blank', 'noopener');
}

// Get human readable name for tooltips; null if unknown
export function getExplorerName(chainId: number | null | undefined): string | null {
  const cfg = chainId != null ? CHAIN_EXPLORERS[chainId] : undefined;
  return cfg ? cfg.name : null;
}
