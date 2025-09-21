import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeRoom, setActiveRoom] = useState('general');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const rooms = [
    { id: 'general', name: '# general', icon: '💬' },
    { id: 'projects', name: '# projects', icon: '🚀' },
    { id: 'ai-help', name: '# ai-help', icon: '🤖' },
    { id: 'token-talk', name: '# token-talk', icon: '💰' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">AI Work Engine</h1>
          <p className="text-sm text-gray-400">Build the future together</p>
        </div>

        {/* Rooms */}
        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Channels
            </h3>
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`sidebar-item ${activeRoom === room.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveRoom(room.id);
                  router.push(`/chat/${room.id}`);
                }}
              >
                <span className="mr-2">{room.icon}</span>
                {room.name}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              AI Tools
            </h3>
            <div className="sidebar-item" onClick={() => router.push('/ai/project-creator')}>
              <span className="mr-2">✨</span>
              Project Creator
            </div>
            <div className="sidebar-item" onClick={() => router.push('/ai/token-allocator')}>
              <span className="mr-2">⚖️</span>
              Token Allocator
            </div>
            <div className="sidebar-item" onClick={() => router.push('/ai/team-matcher')}>
              <span className="mr-2">🎯</span>
              Team Matcher
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Quick Actions
            </h3>
            <div className="sidebar-item" onClick={() => router.push('/projects')}>
              <span className="mr-2">📋</span>
              My Projects
            </div>
            <div className="sidebar-item" onClick={() => router.push('/profile')}>
              <span className="mr-2">👤</span>
              Profile
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {user.walletAddress?.slice(0, 2).toUpperCase()}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-white">
                  {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                </p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}