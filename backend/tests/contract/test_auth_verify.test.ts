import request from 'supertest';
import { app } from '../../src/index';

describe('GET /api/auth/verify', () => {
  it('should verify valid JWT token', async () => {
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'Bearer valid-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('walletAddress');
    expect(response.body).toHaveProperty('isOnline');
  });

  it('should reject invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  it('should reject missing token', async () => {
    const response = await request(app)
      .get('/api/auth/verify');

    expect(response.status).toBe(401);
  });
});