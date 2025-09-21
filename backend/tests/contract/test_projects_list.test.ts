import request from 'supertest';
import { app } from '../../src/index';

describe('GET /api/projects', () => {
  const authToken = 'Bearer valid-jwt-token';

  it('should return user projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', authToken);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((project: any) => {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('members');
    });
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/projects');

    expect(response.status).toBe(401);
  });
});