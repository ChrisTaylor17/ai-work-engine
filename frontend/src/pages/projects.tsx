import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectDashboard from '../components/ProjectDashboard';
import AIChat from '../components/AIChat';

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    description: '',
    requiredSkills: '',
    teamSize: 3
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          description: createForm.description,
          requiredSkills: createForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
          teamSize: createForm.teamSize
        })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({ description: '', requiredSkills: '', teamSize: 3 });
        fetchProjects();
      } else {
        const error = await response.json();
        alert('Project creation failed: ' + error.error);
      }
    } catch (error) {
      console.error('Project creation error:', error);
      alert('Project creation failed');
    }
  };

  const handleAIAction = (action: any) => {
    if (action.type === 'create_project') {
      setCreateForm(prev => ({
        ...prev,
        description: action.parameters.description || prev.description
      }));
      setShowCreateModal(true);
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Work Engine</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-600 hover:text-gray-900"
            >
              Profile
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                router.push('/');
              }}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProjectDashboard 
              projects={projects}
              onCreateProject={() => setShowCreateModal(true)}
            />
          </div>
          
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
            <AIChat onActionRequested={handleAIAction} />
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Describe what you want to build..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={createForm.requiredSkills}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, requiredSkills: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="JavaScript, React, Solana..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Team Size</label>
                <select
                  value={createForm.teamSize}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={2}>2 members</option>
                  <option value={3}>3 members</option>
                  <option value={4}>4 members</option>
                  <option value={5}>5 members</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!createForm.description.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}