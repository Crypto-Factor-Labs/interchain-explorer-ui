export const environment = {
  production: true,
  APP_BASE_URL: '{{apiBaseUrl}}',
  APP_POLL_FREQ: '{{apiProdFreq}}',

  externalExplorers: {
    1131: { name: 'DeFiMetaChain', baseUrl: '{{defichainExplorerBaseUrl}}', prefixWith0x: true },
    18500: { name: 'PartisiaBlockchain', baseUrl: '{{partisiaExplorerBaseUrl}}', prefixWith0x: false },
    80002: { name: 'PolygonScan', baseUrl: '{{polygonExplorerBaseUrl}}', prefixWith0x: true },
  } as Record<number, { name: string; baseUrl: string; prefixWith0x?: boolean }>,
};
