import {
  InventoryAdjustment,
  InventoryItem,
  NewInventoryItem,
  UpdateInventoryItem
} from "./types.js";

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

const validateItemPayload = (payload: NewInventoryItem | UpdateInventoryItem) => {
  if (!payload.name?.trim() || !payload.sku?.trim() || !payload.location?.trim()) {
    throw new Error("name、sku、location 不可為空");
  }

  if (payload.quantity < 0 || payload.reorderPoint < 0) {
    throw new Error("quantity 與 reorderPoint 不可小於 0");
  }
};

export const listItems = (): InventoryItem[] => inventory;

export const addItem = (payload: NewInventoryItem): InventoryItem => {
  validateItemPayload(payload);

  const skuExists = inventory.some((item) => item.sku.toLowerCase() === payload.sku.toLowerCase());
  if (skuExists) {
    throw new Error("sku 已存在");
  }

  const nextId = String(Math.max(0, ...inventory.map((item) => Number(item.id) || 0)) + 1);
  const item: InventoryItem = {
    id: nextId,
    name: payload.name.trim(),
    sku: payload.sku.trim(),
    quantity: payload.quantity,
    reorderPoint: payload.reorderPoint,
    location: payload.location.trim(),
    updatedAt: now()
  };

  inventory.push(item);
  return item;
};

export const updateItem = (id: string, payload: UpdateInventoryItem): InventoryItem => {
  validateItemPayload(payload);

  const target = inventory.find((item) => item.id === id);
  if (!target) {
    throw new Error("Item not found");
  }

  const skuExists = inventory.some(
    (item) => item.id !== id && item.sku.toLowerCase() === payload.sku.toLowerCase()
  );
  if (skuExists) {
    throw new Error("sku 已存在");
  }

  target.name = payload.name.trim();
  target.sku = payload.sku.trim();
  target.quantity = payload.quantity;
  target.reorderPoint = payload.reorderPoint;
  target.location = payload.location.trim();
  target.updatedAt = now();

  return target;
};

export const deleteItem = (id: string): InventoryItem => {
  const index = inventory.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Item not found");
  }

  const [removed] = inventory.splice(index, 1);
  return removed;
};

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
