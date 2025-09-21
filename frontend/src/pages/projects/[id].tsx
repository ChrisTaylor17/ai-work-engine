import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TokenBalance from '../../components/TokenBalance';
import AIChat from '../../components/AIChat';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contributionForm, setContributionForm] = useState({
    description: '',
    evidence: ''
  });

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

    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContribution = async () => {
    if (!contributionForm.description.trim()) return;

    try {
      const response = await fetch(`/api/projects/${id}/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contributionForm)
      });

      if (response.ok) {
        setContributionForm({ description: '', evidence: '' });
        alert('Contribution submitted successfully!');
        fetchProject();
      } else {
        const error = await response.json();
        alert('Failed to submit contribution: ' + error.error);
      }
    } catch (error) {
      console.error('Contribution submission error:', error);
      alert('Failed to submit contribution');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/projects')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Projects
            </button>
            <h1 className="text-xl font-bold">{project.name}</h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            project.status === 'active' ? 'bg-green-100 text-green-800' :
            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {project.status}
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Team Members</h3>
                  <div className="space-y-2">
                    {project.members?.map((member: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                          {member.user.profile?.displayName?.[0] || member.user.walletAddress[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {member.user.profile?.displayName || `User ${member.user.walletAddress.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Token Info</h3>
                  <p className="text-sm text-gray-600">Symbol: ${project.tokenSymbol}</p>
                  <p className="text-sm text-gray-600">Total Supply: {parseInt(project.totalSupply).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Submit Work Contribution</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={contributionForm.description}
                    onChange={(e) => setContributionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Describe what you accomplished..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Evidence (optional)</label>
                  <input
                    type="text"
                    value={contributionForm.evidence}
                    onChange={(e) => setContributionForm(prev => ({ ...prev, evidence: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Link to your work, GitHub PR, etc."
                  />
                </div>
                <button
                  onClick={handleSubmitContribution}
                  disabled={!contributionForm.description.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Submit Contribution
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {user && (
              <TokenBalance projectId={project.id} userId={user.id} />
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Project AI Assistant</h2>
              <AIChat projectId={project.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}