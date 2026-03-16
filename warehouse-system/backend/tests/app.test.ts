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
});
