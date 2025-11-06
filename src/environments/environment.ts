export const environment = {
  production: false,
  APP_BASE_URL: 'http://localhost:3000',
  APP_POLL_FREQ: '60000',

  externalExplorers: {
    1131: { name: 'DeFiMetaChain', baseUrl: ' https://testnet-dmc.mydefichain.com:8441/tx/' },
    18500: { name: 'PartisiaBlockchain', baseUrl: 'https://browser.testnet.partisiablockchain.com/transactions/' },
    80002: { name: 'PolygonScan', baseUrl: 'https://amoy.polygonscan.com/tx/' },
  } as Record<number, { name: string; baseUrl: string }>,
};
