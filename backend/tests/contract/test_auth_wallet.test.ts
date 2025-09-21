import request from 'supertest';
import { app } from '../../src/index';

describe('POST /api/auth/wallet', () => {
  it('should connect wallet with valid signature', async () => {
    const response = await request(app)
      .post('/api/auth/wallet')
      .send({
        walletAddress: '11111111111111111111111111111112',
        signature: 'valid-signature'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('walletAddress');
  });

  it('should reject invalid signature', async () => {
    const response = await request(app)
      .post('/api/auth/wallet')
      .send({
        walletAddress: '11111111111111111111111111111112',
        signature: 'invalid-signature'
      });

    expect(response.status).toBe(401);
  });

  it('should reject missing wallet address', async () => {
    const response = await request(app)
      .post('/api/auth/wallet')
      .send({
        signature: 'valid-signature'
      });

    expect(response.status).toBe(400);
  });
});