import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 font-mono retro-glow">
          &gt; PROFILE_SETUP
        </h1>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name..."
            className="w-full input-field rounded-none px-4 py-2"
          />
          <textarea
            placeholder="Your skills (e.g. React, Python, Design)..."
            className="w-full input-field rounded-none px-4 py-2 h-24 resize-none"
          />
          <button
            onClick={() => router.push('/ai/project-creator')}
            className="w-full btn-primary rounded-none py-3"
          >
            CONTINUE_TO_AI
          </button>
        </div>
      </div>
    </div>
  );
}