import request from 'supertest';
import { app } from '../../src/server';
import { canvas } from '../../src/singletons/canvas';
import { queue } from '../../src/singletons/queue';

describe('GET /init', () => {
  it('should return expected data', async () => {
    // Setup some test data
    canvas.update({ "0_0": "a", "1_1": "b" });
    
    const response = await request(app)
      .get('/init')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      canvas: { "0_0": "a", "1_1": "b" },
      queue: queue.size()
    });
  });

  afterEach(() => {
    // Clean up test data
    canvas.update({});
  });
});