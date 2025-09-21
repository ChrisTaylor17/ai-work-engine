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
    { id: 'general', name: '> general_chat', icon: '💬' },
    { id: 'projects', name: '> project_hub', icon: '🚀' },
    { id: 'ai-help', name: '> ai_terminal', icon: '🤖' },
    { id: 'token-talk', name: '> token_exchange', icon: '💰' },
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
      <div className="w-64 bg-black border-r border-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white">
          <h1 className="text-xl font-bold text-white retro-glow terminal-cursor">AI_WORK_ENGINE</h1>
          <p className="text-sm text-gray-400 font-mono">&gt; TERMINAL_READY</p>
        </div>

        {/* Rooms */}
        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 font-mono">
              [CHANNELS]
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
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 font-mono">
              [AI_TOOLS]
            </h3>
            <div className="sidebar-item" onClick={() => router.push('/ai/project-creator')}>
              <span className="mr-2">✨</span>
              project_creator.exe
            </div>
            <div className="sidebar-item" onClick={() => router.push('/ai/token-allocator')}>
              <span className="mr-2">⚖️</span>
              token_allocator.exe
            </div>
            <div className="sidebar-item" onClick={() => router.push('/ai/team-matcher')}>
              <span className="mr-2">🎯</span>
              team_matcher.exe
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 font-mono">
              [QUICK_ACTIONS]
            </h3>
            <div className="sidebar-item" onClick={() => router.push('/projects')}>
              <span className="mr-2">📋</span>
              my_projects.txt
            </div>
            <div className="sidebar-item" onClick={() => router.push('/profile')}>
              <span className="mr-2">👤</span>
              user_profile.cfg
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center text-sm font-bold font-mono">
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