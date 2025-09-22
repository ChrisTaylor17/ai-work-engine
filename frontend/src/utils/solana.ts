import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

export const getSolanaPrice = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    return data.solana?.usd || 0;
  } catch (error) {
    console.error('Failed to fetch SOL price:', error);
    return 0;
  }
};

export const getTokenPrices = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,raydium,orca,mango-markets&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true');
    const data = await response.json();
    
    return [
      {
        symbol: 'SOL',
        name: 'Solana',
        price: data.solana?.usd || 0,
        change24h: data.solana?.usd_24h_change || 0,
        volume: data.solana?.usd_24h_vol || 0,
        marketCap: data.solana?.usd_market_cap || 0
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        price: data['usd-coin']?.usd || 1,
        change24h: data['usd-coin']?.usd_24h_change || 0,
        volume: data['usd-coin']?.usd_24h_vol || 0,
        marketCap: data['usd-coin']?.usd_market_cap || 0
      },
      {
        symbol: 'RAY',
        name: 'Raydium',
        price: data.raydium?.usd || 0,
        change24h: data.raydium?.usd_24h_change || 0,
        volume: data.raydium?.usd_24h_vol || 0,
        marketCap: data.raydium?.usd_market_cap || 0
      },
      {
        symbol: 'ORCA',
        name: 'Orca',
        price: data.orca?.usd || 0,
        change24h: data.orca?.usd_24h_change || 0,
        volume: data.orca?.usd_24h_vol || 0,
        marketCap: data.orca?.usd_market_cap || 0
      },
      {
        symbol: 'MNGO',
        name: 'Mango',
        price: data['mango-markets']?.usd || 0,
        change24h: data['mango-markets']?.usd_24h_change || 0,
        volume: data['mango-markets']?.usd_24h_vol || 0,
        marketCap: data['mango-markets']?.usd_market_cap || 0
      }
    ];
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    return [];
  }
};

export const getSolanaStats = async () => {
  try {
    const [epochInfo, supply, performanceSamples] = await Promise.all([
      connection.getEpochInfo(),
      connection.getSupply(),
      connection.getRecentPerformanceSamples(1)
    ]);

    const tps = performanceSamples[0]?.numTransactions / performanceSamples[0]?.samplePeriodSecs || 0;

    return {
      epoch: epochInfo.epoch,
      slot: epochInfo.absoluteSlot,
      totalSupply: supply.value.total / LAMPORTS_PER_SOL,
      circulatingSupply: supply.value.circulating / LAMPORTS_PER_SOL,
      tps: Math.round(tps),
      validators: epochInfo.slotIndex // Approximate
    };
  } catch (error) {
    console.error('Failed to fetch Solana stats:', error);
    return {
      epoch: 0,
      slot: 0,
      totalSupply: 0,
      circulatingSupply: 0,
      tps: 0,
      validators: 0
    };
  }
};