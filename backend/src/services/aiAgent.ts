import OpenAI from 'openai';
import { ConversationModel } from '../models/conversation';
import { AIDecisionLogModel } from '../models/aiDecisionLog';
import { WorkContributionModel } from '../models/workContribution';

export interface ChatResponse {
  response: string;
  actions: AIAction[];
}

export interface AIAction {
  type: 'create_project' | 'allocate_tokens' | 'match_users';
  parameters: any;
  requiresConfirmation: boolean;
}

export interface UserMatch {
  userId: string;
  walletAddress: string;
  skillMatch: number;
  availabilityScore: number;
  overallScore: number;
}

export interface MatchingResult {
  matches: UserMatch[];
  confidence: number;
  reasoning: string;
}

export interface EvaluationResult {
  score: number;
  tokenReward: string;
  reasoning: string;
  ipfsHash: string;
}

export class AIAgentService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async chat(userId: string, message: string, projectId?: string): Promise<ChatResponse> {
    try {
      // Store user message
      await ConversationModel.create({
        userId,
        projectId,
        message,
        role: 'user'
      });

      // Get conversation history
      const history = projectId 
        ? await ConversationModel.findByProject(projectId, 10)
        : await ConversationModel.findByUser(userId, 10);

      // Create OpenAI messages
      const messages = [
        {
          role: 'system' as const,
          content: 'You are an AI agent for a decentralized work platform. Help users form projects, match with teammates, and manage token allocations.'
        },
        ...history.reverse().map(h => ({
          role: h.role as 'user' | 'assistant',
          content: h.message
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now.';

      // Store AI response
      await ConversationModel.create({
        userId,
        projectId,
        message: response,
        role: 'assistant'
      });

      // Extract potential actions (simplified)
      const actions: AIAction[] = [];
      if (message.toLowerCase().includes('create project')) {
        actions.push({
          type: 'create_project',
          parameters: { description: message },
          requiresConfirmation: true
        });
      }

      return { response, actions };
    } catch (error) {
      throw new Error(`AI chat failed: ${error}`);
    }
  }

  async matchUsers(
    projectDescription: string,
    requiredSkills: string[] = [],
    teamSize: number = 3,
    excludeUserIds: string[] = []
  ): Promise<MatchingResult> {
    try {
      // Log decision context
      const decisionLog = await AIDecisionLogModel.create({
        decisionType: 'matching',
        context: {
          projectDescription,
          requiredSkills,
          teamSize,
          excludeUserIds
        },
        result: {} // Will update after matching
      });

      // Simplified matching algorithm for MVP
      // In production, use more sophisticated ML-based matching
      const matches: UserMatch[] = [];
      
      // Mock matches for development
      for (let i = 0; i < Math.min(teamSize - 1, 3); i++) {
        matches.push({
          userId: `mock-user-${i}`,
          walletAddress: `mock-wallet-${i}`,
          skillMatch: 0.8 + Math.random() * 0.2,
          availabilityScore: 1.0,
          overallScore: 0.85 + Math.random() * 0.15
        });
      }

      const result = {
        matches,
        confidence: 0.85,
        reasoning: `Matched users based on skill overlap with required skills: ${requiredSkills.join(', ')}`
      };

      // Update decision log
      await AIDecisionLogModel.create({
        decisionType: 'matching',
        context: { projectDescription, requiredSkills, teamSize },
        result
      });

      return result;
    } catch (error) {
      throw new Error(`User matching failed: ${error}`);
    }
  }

  async evaluateContribution(contributionId: string): Promise<EvaluationResult> {
    try {
      const contribution = await WorkContributionModel.findById(contributionId);
      if (!contribution) {
        throw new Error('Contribution not found');
      }

      // Log decision context
      const decisionContext = {
        contributionId,
        description: contribution.description,
        projectId: contribution.projectId,
        userId: contribution.userId
      };

      // Simplified evaluation for MVP
      // In production, use more sophisticated analysis
      const score = 0.7 + Math.random() * 0.3; // 0.7-1.0 range
      const tokenReward = Math.floor(score * 1000).toString(); // 700-1000 tokens
      const reasoning = `Evaluated contribution based on description quality, evidence provided, and project context. Score: ${score.toFixed(2)}`;
      
      // Mock IPFS hash
      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`;

      const result = {
        score,
        tokenReward,
        reasoning,
        ipfsHash
      };

      // Log decision
      await AIDecisionLogModel.create({
        decisionType: 'evaluation',
        context: decisionContext,
        result,
        ipfsHash
      });

      // Update contribution with evaluation
      await WorkContributionModel.update(contributionId, {
        aiScore: score,
        tokenReward: BigInt(tokenReward),
        evaluatedAt: new Date()
      });

      return result;
    } catch (error) {
      throw new Error(`Contribution evaluation failed: ${error}`);
    }
  }
}