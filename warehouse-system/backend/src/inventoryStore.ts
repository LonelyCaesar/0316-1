import { InventoryAdjustment, InventoryItem } from "./types.js";

const now = () => new Date().toISOString();

const inventory: InventoryItem[] = [
  {
    id: "1",
    name: "工業手套",
    sku: "GLO-001",
    quantity: 120,
    reorderPoint: 80,
    location: "A-01",
    updatedAt: now()
  },
  {
    id: "2",
    name: "安全帽",
    sku: "HLM-002",
    quantity: 45,
    reorderPoint: 60,
    location: "B-04",
    updatedAt: now()
  },
  {
    id: "3",
    name: "反光背心",
    sku: "VST-003",
    quantity: 88,
    reorderPoint: 50,
    location: "C-07",
    updatedAt: now()
  }
];

export const listItems = (): InventoryItem[] => inventory;

export const adjustInventory = (payload: InventoryAdjustment): InventoryItem => {
  const target = inventory.find((item) => item.id === payload.itemId);
  if (!target) {
    throw new Error("Item not found");
  }

  const next = target.quantity + payload.delta;
  if (next < 0) {
    throw new Error("Quantity cannot be negative");
  }

  target.quantity = next;
  target.updatedAt = now();
  return target;
};

export const lowStockItems = (): InventoryItem[] =>
  inventory.filter((item) => item.quantity <= item.reorderPoint);
