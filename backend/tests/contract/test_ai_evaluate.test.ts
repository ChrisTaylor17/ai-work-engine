import request from 'supertest';
import { app } from '../../src/index';

describe('POST /api/ai/evaluate', () => {
  const authToken = 'Bearer valid-jwt-token';

  it('should evaluate work contribution', async () => {
    const response = await request(app)
      .post('/api/ai/evaluate')
      .set('Authorization', authToken)
      .send({
        contributionId: 'test-contribution-id',
        context: 'Frontend development task'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('score');
    expect(response.body).toHaveProperty('tokenReward');
    expect(response.body).toHaveProperty('reasoning');
    expect(response.body).toHaveProperty('ipfsHash');
    expect(typeof response.body.score).toBe('number');
    expect(response.body.score).toBeGreaterThanOrEqual(0);
    expect(response.body.score).toBeLessThanOrEqual(1);
  });

  it('should require contribution ID', async () => {
    const response = await request(app)
      .post('/api/ai/evaluate')
      .set('Authorization', authToken)
      .send({
        context: 'Test context'
      });

    expect(response.status).toBe(400);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/ai/evaluate')
      .send({
        contributionId: 'test-id'
      });

    expect(response.status).toBe(401);
  });
});