import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('warehouse api integration', () => {
  it('returns inventory list array', async () => {
    const response = await request(app).get('/api/inventory');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('adds and deletes one inventory item', async () => {
    const createResponse = await request(app).post('/api/inventory').send({
      name: '防塵口罩',
      sku: `MSK-${Date.now()}`,
      quantity: 30,
      reorderPoint: 20,
      location: 'D-01'
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe('防塵口罩');

    const deleteResponse = await request(app).delete(`/api/inventory/${createResponse.body.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.ok).toBe(true);
  });

  it('adjust inventory success', async () => {
    const response = await request(app).post('/api/inventory/adjust').send({
      itemId: '1',
      delta: -10,
      reason: '出貨'
    });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBeGreaterThanOrEqual(0);
  });

  it('returns inventory summary object', async () => {
    const response = await request(app).get('/api/ai/summary');

    expect(response.status).toBe(200);
    expect(typeof response.body.totalItems).toBe('number');
    expect(Array.isArray(response.body.suggestions)).toBe(true);
  });
});
