import { UserModel } from '../models/user';
import { AIAgentService } from './aiAgent';

export interface MatchingCriteria {
  requiredSkills: string[];
  preferredSkills?: string[];
  teamSize: number;
  excludeUserIds?: string[];
}

export interface SkillVector {
  userId: string;
  skills: string[];
  interests: string[];
  availability: string;
  vector: number[];
}

export class MatchingService {
  private aiAgent: AIAgentService;

  constructor() {
    this.aiAgent = new AIAgentService();
  }

  async findMatches(
    founderId: string,
    projectDescription: string,
    criteria: MatchingCriteria
  ) {
    // Get available users
    const availableUsers = await UserModel.findAvailable([
      founderId,
      ...(criteria.excludeUserIds || [])
    ]);

    if (availableUsers.length < criteria.teamSize - 1) {
      throw new Error('Insufficient available users for team formation');
    }

    // Use AI agent for sophisticated matching
    const matchingResult = await this.aiAgent.matchUsers(
      projectDescription,
      criteria.requiredSkills,
      criteria.teamSize,
      [founderId, ...(criteria.excludeUserIds || [])]
    );

    // Map AI results to actual users
    const matches = matchingResult.matches.map((match, index) => {
      const user = availableUsers[index % availableUsers.length];
      return {
        ...match,
        userId: user.id,
        walletAddress: user.walletAddress,
        user
      };
    }).slice(0, criteria.teamSize - 1);

    return {
      matches,
      confidence: matchingResult.confidence,
      reasoning: matchingResult.reasoning
    };
  }

  private calculateSkillSimilarity(skills1: string[], skills2: string[]): number {
    if (skills1.length === 0 || skills2.length === 0) return 0;

    const intersection = skills1.filter(skill => 
      skills2.some(s => s.toLowerCase() === skill.toLowerCase())
    );
    
    const union = [...new Set([...skills1, ...skills2])];
    
    return intersection.length / union.length;
  }

  private calculateInterestSimilarity(interests1: string[], interests2: string[]): number {
    if (interests1.length === 0 || interests2.length === 0) return 0;

    const intersection = interests1.filter(interest => 
      interests2.some(i => i.toLowerCase() === interest.toLowerCase())
    );
    
    return intersection.length / Math.max(interests1.length, interests2.length);
  }

  private getAvailabilityScore(availability: string): number {
    switch (availability) {
      case 'available': return 1.0;
      case 'busy': return 0.3;
      case 'offline': return 0.0;
      default: return 0.5;
    }
  }
}