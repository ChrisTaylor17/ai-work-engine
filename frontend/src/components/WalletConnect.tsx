import { useState } from 'react';

interface WalletConnectProps {
  onConnect: (walletAddress: string, signature: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const { solana } = window as any;
      
      if (!solana) {
        alert('Please install Phantom wallet');
        return;
      }

      const response = await solana.connect();
      const walletAddress = response.publicKey.toString();
      
      // Create a simple signature for authentication
      const message = `Sign this message to authenticate with AI Work Engine: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await solana.signMessage(encodedMessage);
      const signature = Buffer.from(signedMessage.signature).toString('hex');
      
      onConnect(walletAddress, signature);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full btn-primary"
      >
        {isConnecting ? 'Connecting...' : 'Connect Phantom Wallet'}
      </button>
      
      <p className="text-sm text-gray-400 text-center">
        Connect your Solana wallet to start earning tokens and creating projects
      </p>
    </div>
  );
}