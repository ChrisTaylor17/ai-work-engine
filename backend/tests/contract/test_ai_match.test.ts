import request from 'supertest';
import { app } from '../../src/index';

describe('POST /api/ai/match', () => {
  const authToken = 'Bearer valid-jwt-token';

  it('should return matching users', async () => {
    const response = await request(app)
      .post('/api/ai/match')
      .set('Authorization', authToken)
      .send({
        projectDescription: 'Build a DeFi trading bot',
        requiredSkills: ['JavaScript', 'Solana'],
        teamSize: 3
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('matches');
    expect(response.body).toHaveProperty('confidence');
    expect(response.body).toHaveProperty('reasoning');
    expect(Array.isArray(response.body.matches)).toBe(true);
    
    response.body.matches.forEach((match: any) => {
      expect(match).toHaveProperty('userId');
      expect(match).toHaveProperty('skillMatch');
      expect(match).toHaveProperty('overallScore');
    });
  });

  it('should require project description', async () => {
    const response = await request(app)
      .post('/api/ai/match')
      .set('Authorization', authToken)
      .send({
        requiredSkills: ['JavaScript']
      });

    expect(response.status).toBe(400);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/ai/match')
      .send({
        projectDescription: 'Test project'
      });

    expect(response.status).toBe(401);
  });
});