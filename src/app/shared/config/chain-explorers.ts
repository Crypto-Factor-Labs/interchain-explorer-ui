export type ExplorerConfig = { name: string; baseUrl: string };

// Map ChainId -> BaseURL of external explorer
export const CHAIN_EXPLORERS: Record<number, ExplorerConfig> = {
  1: { name: 'Ethereum', baseUrl: 'https://etherscan.io/tx/' },
  1131: { name: 'DeFiMetaChain', baseUrl: 'https://mainnet-dmc.mydefichain.com:8441/tx/' },
  18500: { name: 'PartisiaBlockchain', baseUrl: 'https://browser.partisiablockchain.com/transactions/' },
  80002: { name: 'PolygonScan', baseUrl: 'https://polygonscan.com/tx/' },
};
