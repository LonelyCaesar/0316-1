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

  it('deletes an existing inventory item', async () => {
    const created = await request(app).post('/api/inventory').send({
      name: '測試刪除品項',
      sku: 'DEL-001',
      quantity: 1,
      reorderPoint: 1,
      location: 'Z-09'
    });

    const response = await request(app).delete(`/api/inventory/${created.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);

    const inventory = await request(app).get('/api/inventory');
    expect(inventory.body.find((item: { id: string }) => item.id === created.body.id)).toBeUndefined();
  });
});
