import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  tokenSymbol: string;
  members: Array<{
    user: {
      walletAddress: string;
      profile?: {
        displayName?: string;
      };
    };
    role: string;
  }>;
}

interface ProjectDashboardProps {
  projects: Project[];
  onCreateProject: () => void;
}

export default function ProjectDashboard({ projects, onCreateProject }: ProjectDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'dissolved': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button
          onClick={onCreateProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={onCreateProject}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                  </span>
                  <span className="font-mono text-blue-600">
                    ${project.tokenSymbol}
                  </span>
                </div>
                
                <div className="mt-2 flex -space-x-2">
                  {project.members.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs"
                      title={member.user.profile?.displayName || member.user.walletAddress.slice(0, 8)}
                    >
                      {member.user.profile?.displayName?.[0] || member.user.walletAddress[0]}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}