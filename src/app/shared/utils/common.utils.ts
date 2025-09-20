import { TransactionStateEnum } from '../../shared/enums/transaction-state.enum.js';

export function getChainImage(chainId: string | number | null | undefined): string {
  const DEFAULT_IMG = 'assets/images/interchain_logo.png';
  if (chainId == null) return DEFAULT_IMG; // null or undefined

  // Normalize to a number; empty strings or non-numeric → NaN
  const id =
    typeof chainId === 'number'
      ? chainId
      : chainId.trim() === ''
        ? NaN
        : Number(chainId);

  if (!Number.isFinite(id)) return DEFAULT_IMG;

  switch (id) {
    case 1130:
    case 1131:
      return 'assets/images/defichain_logo.png';
    case 18500:
      return 'assets/images/partisia_logo.png';
    case 80002:
      return 'assets/images/polygon_logo.png';
    default:
      return DEFAULT_IMG;
  }
}

export function txStateToWord(state: TransactionStateEnum | number | null | undefined): string {
  if (!Number.isInteger(state)) return 'UNKNOWN';
  const name = TransactionStateEnum[state as TransactionStateEnum]; // e.g. "PENDING_IN_MEMPOOL"
  return name ? name.replace(/_/g, ' ') : 'UNKNOWN';
}
