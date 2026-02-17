import request from 'supertest';
import { app } from '../../src/server';

describe('GET /ok', () => {
  it('should return ok', async () => {
    const response = await request(app)
      .get('/ok')
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('OK');
  });
});