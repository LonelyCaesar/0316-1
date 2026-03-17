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


  it('deletes inventory item', async () => {
    const before = await request(app).get('/api/inventory');
    const targetId = before.body[0].id;

    const deleted = await request(app).delete(`/api/inventory/${targetId}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body.id).toBe(targetId);

    const after = await request(app).get('/api/inventory');
    expect(after.body.some((item: { id: string }) => item.id === targetId)).toBe(false);
  });
});
