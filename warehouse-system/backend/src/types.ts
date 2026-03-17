export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
  updatedAt: string;
}

export interface InventoryAdjustment {
  itemId: string;
  delta: number;
  reason: string;
}
export interface NewInventoryItem {
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
}