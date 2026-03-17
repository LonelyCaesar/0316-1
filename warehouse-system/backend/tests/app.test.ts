import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("warehouse api", () => {
  it("returns inventory list", async () => {
    const response = await request(app).get("/api/inventory");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("adds inventory item", async () => {
    const sku = `MSK-${Date.now()}`;
    const response = await request(app).post("/api/inventory").send({
      name: "防塵口罩",
      sku,
      quantity: 30,
      reorderPoint: 20,
      location: "D-01"
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("防塵口罩");
    expect(response.body.sku).toBe(sku);
  });

  it("adjust inventory success", async () => {
    const list = await request(app).get("/api/inventory");
    const targetId = list.body[0].id as string;

    const response = await request(app).post("/api/inventory/adjust").send({
      itemId: targetId,
      delta: -1,
      reason: "出貨"
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(targetId);
    expect(response.body.quantity).toBeGreaterThanOrEqual(0);
  });

  it("does not include suggestions when quantity equals reorder point", async () => {
    const sku = `EQ-${Date.now()}`;
    const created = await request(app).post("/api/inventory").send({
      name: "等於門檻測試品",
      sku,
      quantity: 10,
      reorderPoint: 15,
      location: "Z-01"
    });

    expect(created.status).toBe(201);

    const itemId = created.body.id as string;
    await request(app).post("/api/inventory/adjust").send({ itemId, delta: 5 });

    const summary = await request(app).get("/api/ai/summary");
    expect(summary.status).toBe(200);
    const ids = summary.body.suggestions.map((s: { itemId: string }) => s.itemId);
    expect(ids).not.toContain(itemId);

    await request(app).delete(`/api/inventory/${itemId}`);
  });
});
