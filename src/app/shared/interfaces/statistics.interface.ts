export interface Statistics {
  cfr_price_usd: string;
  cfr_tvl_usd: string;
  avg_block_speed_24hr: string;
  avg_block_speed_30d: string;
}

export interface PricePoint {
  timestamp: string;
  price_usd: string;
}
