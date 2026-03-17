import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("warehouse api", () => {
  it("returns inventory list", async () => {
    const app = createApp();
    const response = await request(app).get("/api/inventory");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it("adds inventory item", async () => {
    const app = createApp();
    const response = await request(app).post("/api/inventory").send({
      name: "防塵口罩",
      sku: "MSK-004",
      quantity: 30,
      reorderPoint: 20,
      location: "D-01"
    });

    expect(response.status).toBe(201);
    expect(response.body.item.name).toBe("防塵口罩");
    expect(response.body.item.sku).toBe("MSK-004");
  });

  it("rejects duplicated sku", async () => {
    const app = createApp();
    const response = await request(app).post("/api/inventory").send({
      name: "另一種口罩",
      sku: "MSK-004",
      quantity: 10,
      reorderPoint: 5,
      location: "D-02"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("sku");
  });

  it("adjust inventory success", async () => {
    const app = createApp();
    const response = await request(app).post("/api/inventory/adjust").send({
      itemId: "1",
      delta: -10,
      reason: "出貨"
    });

    expect(response.status).toBe(200);
    expect(response.body.item.quantity).toBeGreaterThanOrEqual(0);
  });

  it("returns local inventory summary", async () => {
    const app = createApp();
    const response = await request(app).get("/api/ai/summary");

    expect(response.status).toBe(200);
    expect(typeof response.body.summary).toBe("string");
    expect(response.body.summary.length).toBeGreaterThan(0);
  });
});
