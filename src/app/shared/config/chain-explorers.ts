import { environment } from '../../../environments/environment';

export type ExplorerConfig = { name: string; baseUrl: string };

export const CHAIN_EXPLORERS: Record<number, ExplorerConfig> =
  environment.externalExplorers;

/*
export type ExplorerConfig = { name: string; baseUrl: string };

// Map ChainId -> BaseURL of external explorer
export const CHAIN_EXPLORERS: Record<number, ExplorerConfig> = {
  1131: { name: 'DeFiMetaChain', baseUrl: 'https://mainnet-dmc.mydefichain.com:8441/tx/' },
  18500: { name: 'PartisiaBlockchain', baseUrl: 'https://browser.partisiablockchain.com/transactions/' },
  80002: { name: 'PolygonScan', baseUrl: 'https://polygonscan.com/tx/' },
};
*/
