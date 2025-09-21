import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([
    { id: 1, name: 'DeFi_Yield_Optimizer', status: 'ACTIVE', tokens: 500, members: 3 },
    { id: 2, name: 'NFT_Marketplace_v2', status: 'RECRUITING', tokens: 750, members: 2 },
    { id: 3, name: 'Social_Trading_App', status: 'COMPLETED', tokens: 300, members: 4 }
  ]);
  const [newProject, setNewProject] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, []);

  const handleCreateProject = () => {
    if (!newProject.trim()) return;
    
    const project = {
      id: Date.now(),
      name: newProject.replace(/\s+/g, '_'),
      status: 'RECRUITING',
      tokens: Math.floor(Math.random() * 500) + 200,
      members: 1
    };
    
    setProjects(prev => [project, ...prev]);
    setNewProject('');
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col bg-black">
        <div className="bg-black border-b border-white p-4">
          <h1 className="text-xl font-bold text-white font-mono retro-glow">&gt; MY_PROJECTS.TXT</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Create New Project */}
          <div className="card mb-6">
            <h2 className="text-white font-mono mb-4">[CREATE_NEW_PROJECT]</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                placeholder="Enter project name..."
                className="flex-1 input-field rounded-none px-4 py-2"
              />
              <button 
                onClick={handleCreateProject}
                className="btn-primary rounded-none"
              >
                CREATE
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-mono font-bold">{project.name}</h3>
                  <span className={`font-mono text-sm px-2 py-1 border ${
                    project.status === 'ACTIVE' ? 'border-green-500 text-green-500' :
                    project.status === 'RECRUITING' ? 'border-yellow-500 text-yellow-500' :
                    'border-gray-500 text-gray-500'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                  <div>
                    <span className="text-gray-400">TOKENS:</span>
                    <div className="text-white">{project.tokens} WORK</div>
                  </div>
                  <div>
                    <span className="text-gray-400">MEMBERS:</span>
                    <div className="text-white">{project.members}/5</div>
                  </div>
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <div className="text-white">#{project.id}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="btn-secondary rounded-none text-xs px-3 py-1">
                    VIEW_DETAILS
                  </button>
                  <button className="btn-secondary rounded-none text-xs px-3 py-1">
                    MANAGE_TEAM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}