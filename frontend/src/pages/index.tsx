import { useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();
  const { publicKey } = useWallet();

  const joinRoom = (room: string) => {
    if (room.trim()) {
      router.push(`/${room.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
    }
  };

  const quickRooms = ['builders', 'nft-creators', 'defi', 'solana', 'general'];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-2xl">C</span>
          </div>
          <h1 className="text-white font-light text-3xl tracking-widest mb-2">CONSILIENCE</h1>
          <p className="text-white/50 text-sm">AI-powered crypto project builder & community</p>
        </div>

        {/* Wallet */}
        <div className="flex justify-center">
          <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !border-white/20 !text-white !rounded-full" />
        </div>

        {/* Room Entry */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinRoom(roomName)}
              placeholder="Enter room name..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-center"
            />
          </div>
          
          <div className="text-center">
            <span className="text-white/30 text-xs">or join a popular room</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickRooms.map(room => (
              <button
                key={room}
                onClick={() => joinRoom(room)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full px-4 py-2 text-white/70 hover:text-white text-sm transition-all"
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="text-center space-y-2 pt-4">
          <div className="text-white/40 text-xs space-y-1">
            <div>• Chat with others building crypto projects</div>
            <div>• AI helps create NFTs and tokens on Solana</div>
            <div>• Share ideas and collaborate in real-time</div>
          </div>
        </div>
      </div>
    </div>
  );
}