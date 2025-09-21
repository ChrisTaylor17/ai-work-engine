import request from 'supertest';
import { app } from '../../src/index';

describe('POST /api/projects', () => {
  const authToken = 'Bearer valid-jwt-token';

  it('should create project with AI matching', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', authToken)
      .send({
        description: 'Build a DeFi trading bot',
        requiredSkills: ['JavaScript', 'Solana', 'Trading'],
        teamSize: 3
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('tokenMintAddress');
    expect(response.body).toHaveProperty('members');
    expect(response.body.members).toHaveLength(3);
  });

  it('should reject insufficient available users', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', authToken)
      .send({
        description: 'Need 100 developers',
        teamSize: 100
      });

    expect(response.status).toBe(400);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        description: 'Test project'
      });

    expect(response.status).toBe(401);
  });
});