import express from "express";
import cors from "cors";
import { adjustInventory, listItems, lowStockItems } from "./inventoryStore.js";
import { requestOllamaSummary } from "./ollamaClient.js";

export const createApp = () => {
  const app = express();
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1";

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/inventory", (_req, res) => {
    res.json({ items: listItems() });
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

  app.get("/api/ai/summary", async (_req, res) => {
    const items = listItems();
    const low = lowStockItems();
    const prompt = [
      `目前品項總數: ${items.length}`,
      `低於安全庫存品項: ${low.map((x) => `${x.name}(${x.quantity}/${x.reorderPoint})`).join(", ") || "無"}`,
      "請提供三點補貨與倉儲作業優化建議。"
    ].join("\n");

    try {
      const summary = await requestOllamaSummary(ollamaBaseUrl, ollamaModel, prompt);
      res.json({ summary });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ollama 連線失敗";
      res.status(502).json({ error: message });
    }
  });

  return app;
};
