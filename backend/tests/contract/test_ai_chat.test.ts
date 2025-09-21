import request from 'supertest';
import { app } from '../../src/index';

describe('POST /api/ai/chat', () => {
  const authToken = 'Bearer valid-jwt-token';

  it('should respond to chat message', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', authToken)
      .send({
        message: 'Help me find a project to join',
        projectId: null
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
    expect(response.body).toHaveProperty('actions');
    expect(Array.isArray(response.body.actions)).toBe(true);
  });

  it('should handle project-specific chat', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', authToken)
      .send({
        message: 'What tasks need to be done?',
        projectId: 'test-project-id'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Hello'
      });

    expect(response.status).toBe(401);
  });
});