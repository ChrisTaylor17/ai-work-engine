export const createWorkToken = async (amount: number) => {
  // Simulate Solana SPL token creation
  const mintAddress = `WORK${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
  const signature = `${Math.random().toString(16).substr(2, 16)}${Math.random().toString(16).substr(2, 16)}`;
  
  return {
    mintAddress,
    amount,
    signature,
    blockTime: Date.now(),
    slot: Math.floor(Math.random() * 1000000) + 100000
  };
};

export const getTokenBalance = async (walletAddress: string) => {
  return Math.floor(Math.random() * 1000) + 100;
};