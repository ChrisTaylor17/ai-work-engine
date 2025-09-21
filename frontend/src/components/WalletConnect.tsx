import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletConnectProps {
  onConnect: (walletAddress: string, signature: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { publicKey, signMessage, connected } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!publicKey || !signMessage) return;
    
    setIsConnecting(true);
    try {
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with AI Work Engine: ${Date.now()}`
      );
      const signature = await signMessage(message);
      
      onConnect(publicKey.toString(), Buffer.from(signature).toString('base64'));
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <WalletMultiButton />
      
      {connected && publicKey && (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isConnecting ? 'Authenticating...' : 'Sign In'}
        </button>
      )}
    </div>
  );
}