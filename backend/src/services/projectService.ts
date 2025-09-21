import { ProjectModel } from '../models/project';
import { ProjectMemberModel } from '../models/projectMember';
import { MatchingService } from './matching';
import { TokenManagerService } from './tokenManager';

export interface CreateProjectRequest {
  founderId: string;
  description: string;
  requiredSkills?: string[];
  teamSize?: number;
}

export class ProjectService {
  private matchingService: MatchingService;
  private tokenManager: TokenManagerService;

  constructor() {
    this.matchingService = new MatchingService();
    this.tokenManager = new TokenManagerService();
  }

  async createProject(request: CreateProjectRequest) {
    const { founderId, description, requiredSkills = [], teamSize = 3 } = request;

    // Find matching team members
    const matchResult = await this.matchingService.findMatches(founderId, description, {
      requiredSkills,
      teamSize
    });

    // Create project
    const tokenSymbol = `PRJ${Date.now().toString().slice(-6)}`;
    const totalSupply = 1000000;

    const project = await ProjectModel.create({
      name: description.substring(0, 50),
      description,
      tokenMintAddress: 'pending',
      tokenSymbol,
      totalSupply: BigInt(totalSupply)
    });

    // Create project members
    const members = [
      { userId: founderId, projectId: project.id, role: 'founder' as const },
      ...matchResult.matches.map(match => ({
        userId: match.userId,
        projectId: project.id,
        role: 'contributor' as const
      }))
    ];

    await ProjectMemberModel.createMany(members);

    // Get updated project with members
    const updatedProject = await ProjectModel.findById(project.id);
    return updatedProject;
  }
}