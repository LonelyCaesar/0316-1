import cors from 'cors';
import express from 'express';
import { adjustInventory, buildSummary, createItem, deleteItem, getInventory, getLowStock } from './store.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'warehouse-backend' });
});

app.get('/api/inventory', (_req, res) => {
  res.json(getInventory());
});

app.post('/api/inventory', (req, res) => {
  const { name, sku, quantity, reorderPoint, location } = req.body;
  if (!name || !sku || quantity === undefined || reorderPoint === undefined || !location) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const item = createItem({
    name,
    sku,
    quantity: Number(quantity),
    reorderPoint: Number(reorderPoint),
    location
  });
  res.status(201).json(item);
});

app.delete('/api/inventory/:itemId', (req, res) => {
  const item = deleteItem(req.params.itemId);
  if (!item) {
    return res.status(404).json({ message: 'item not found' });
  }
  res.json({ ok: true, deleted: item });
});

app.post('/api/inventory/adjust', (req, res) => {
  const { itemId, delta } = req.body;
  if (!itemId || typeof delta !== 'number') {
    return res.status(400).json({ message: 'itemId and numeric delta are required' });
  }
  const item = adjustInventory({ itemId, delta });
  if (!item) {
    return res.status(404).json({ message: 'item not found' });
  }
  res.json(item);
});

app.get('/api/inventory/low-stock', (_req, res) => {
  res.json(getLowStock());
});

app.get('/api/ai/summary', (_req, res) => {
  res.json(buildSummary());
});
