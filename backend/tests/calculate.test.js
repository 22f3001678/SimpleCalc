import request from 'supertest';
import app from '../server.js';

describe('POST /api/calculate', () => {
  it('returns 400 for empty body', async () => {
    const res = await request(app).post('/api/calculate').send({ expression: '' });
    expect(res.statusCode).toBe(400);
  });
});
