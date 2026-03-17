import express from "express";
import cors from "cors";
import { addItem, adjustInventory, listItems, lowStockItems } from "./inventoryStore.js";
import { adjustInventory, listItems, lowStockItems } from "./inventoryStore.js";
import { generateInventorySummary } from "./inventoryAdvisor.js";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/inventory", (_req, res) => {
    res.json({ items: listItems() });
  });

  app.post("/api/inventory", (req, res) => {
    try {
      const item = addItem(req.body);
      res.status(201).json({ item });
    } catch (error) {
      const message = error instanceof Error ? error.message : "新增商品失敗";
      res.status(400).json({ error: message });
    }
  });

  app.post("/api/inventory/adjust", (req, res) => {
    try {
      const updated = adjustInventory(req.body);
      res.json({ item: updated });
    } catch (error) {
      const message = error instanceof Error ? error.message : "調整失敗";
      res.status(400).json({ error: message });
    }
  });

  app.get("/api/inventory/low-stock", (_req, res) => {
    res.json({ items: lowStockItems() });
  });

  app.get("/api/ai/summary", (_req, res) => {
    const items = listItems();
    const low = lowStockItems();
    const summary = generateInventorySummary(items, low);

    res.json({ summary });
  });

  return app;
};
