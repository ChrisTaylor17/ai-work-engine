import request from 'supertest';
import { app } from '../../src/index';

describe('POST /api/projects/:id/contributions', () => {
  const authToken = 'Bearer valid-jwt-token';
  const projectId = 'test-project-id';

  it('should submit work contribution', async () => {
    const response = await request(app)
      .post(`/api/projects/${projectId}/contributions`)
      .set('Authorization', authToken)
      .send({
        description: 'Completed trading interface mockups',
        evidence: 'https://figma.com/mockups'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('createdAt');
  });

  it('should require description', async () => {
    const response = await request(app)
      .post(`/api/projects/${projectId}/contributions`)
      .set('Authorization', authToken)
      .send({
        evidence: 'https://example.com'
      });

    expect(response.status).toBe(400);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post(`/api/projects/${projectId}/contributions`)
      .send({
        description: 'Test contribution'
      });

    expect(response.status).toBe(401);
  });
});