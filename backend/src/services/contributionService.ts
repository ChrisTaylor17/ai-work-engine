import { WorkContributionModel } from '../models/workContribution';

export interface SubmitContributionRequest {
  userId: string;
  projectId: string;
  description: string;
  evidence?: string;
}

export class ContributionService {
  async submitContribution(request: SubmitContributionRequest) {
    const { userId, projectId, description } = request;

    const contribution = await WorkContributionModel.create({
      userId,
      projectId,
      description
    });

    return contribution;
  }

  async getProjectContributions(projectId: string) {
    return WorkContributionModel.findByProject(projectId);
  }

  async getUserContributions(userId: string) {
    return WorkContributionModel.findByUser(userId);
  }
}