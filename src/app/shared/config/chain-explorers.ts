import { environment } from '../../../environments/environment';

export type ExplorerConfig = {
  name: string;
  baseUrl: string;
  txPath: string;
  addressPath: string;
  prefixWith0x?: boolean;
};

export const CHAIN_EXPLORERS: Record<number, ExplorerConfig> =
  environment.externalExplorers;

