export const environment = {
  production: false,
  APP_BASE_URL: 'http://localhost:3000',
  APP_POLL_FREQ: '60000',

  externalExplorers: {
    1131: { name: 'DeFiMetaChain', baseUrl: 'https://testnet-dmc.mydefichain.com', txPath: '/tx/', addressPath: '/address/', prefixWith0x: true, },
    18500: { name: 'PartisiaBlockchain', baseUrl: 'https://browser.testnet.partisiablockchain.com', txPath: '/transactions/', addressPath: '/accounts/', prefixWith0x: false, },
    80002: { name: 'PolygonScan', baseUrl: 'https://amoy.polygonscan.com', txPath: '/tx/', addressPath: '/address/', prefixWith0x: true, },
  } as Record<number, { name: string; baseUrl: string; txPath: string; addressPath: string; prefixWith0x?: boolean; }>

};
