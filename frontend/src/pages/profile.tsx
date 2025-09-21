import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProfileSetup from '../components/ProfileSetup';

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

  const handleProfileSubmit = async (profileData: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        router.push('/projects');
      } else {
        const error = await response.json();
        alert('Profile update failed: ' + error.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Profile update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Tell us about your skills and interests so our AI can find the perfect projects for you.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <ProfileSetup 
              onSubmit={handleProfileSubmit}
              initialData={user?.profile}
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/projects')}
              className="text-blue-600 hover:text-blue-800"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}