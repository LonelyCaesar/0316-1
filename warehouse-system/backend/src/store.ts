export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
};

export type AdjustmentPayload = {
  itemId: string;
  delta: number;
  reason?: string;
};

const inventory: InventoryItem[] = [
  { id: '1', name: '工業手套', sku: 'GLV-001', quantity: 48, reorderPoint: 20, location: 'A-01' },
  { id: '2', name: '安全帽', sku: 'HMT-002', quantity: 12, reorderPoint: 15, location: 'B-03' },
  { id: '3', name: '護目鏡', sku: 'GGL-003', quantity: 33, reorderPoint: 18, location: 'C-02' }
];

let idCounter = 4;

export const getInventory = () => inventory;

export const createItem = (item: Omit<InventoryItem, 'id'>) => {
  const newItem: InventoryItem = { ...item, id: String(idCounter++) };
  inventory.push(newItem);
  return newItem;
};

export const adjustInventory = ({ itemId, delta }: AdjustmentPayload) => {
  const target = inventory.find((item) => item.id === itemId);
  if (!target) {
    return null;
  }
  target.quantity = Math.max(0, target.quantity + delta);
  return target;
};

export const deleteItem = (id: string) => {
  const index = inventory.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = inventory.splice(index, 1);
  return removed;
};

export const getLowStock = () => inventory.filter((item) => item.quantity < item.reorderPoint);

export const buildSummary = () => {
  const lowStock = getLowStock();
  return {
    totalItems: inventory.length,
    lowStockCount: lowStock.length,
    suggestions: lowStock.map((item) => ({
      itemId: item.id,
      name: item.name,
      suggestedOrder: Math.max(item.reorderPoint * 2 - item.quantity, 0)
    }))
  };
};
