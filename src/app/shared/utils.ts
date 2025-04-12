export function getChainImage(chainId: number): string {
  switch (chainId) {
    case 1130:
    case 1131:
      return 'assets/images/defichain_logo.png';
    case 18500:
      return 'assets/images/partisia_logo.png';
    default:
      return 'assets/images/interchain_logo.png';
  }
}
