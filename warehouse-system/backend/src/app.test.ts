import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('warehouse api', () => {
  it('returns health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('returns inventory list', async () => {
    const response = await request(app).get('/api/inventory');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
