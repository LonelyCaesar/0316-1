import { InventoryItem } from "./types.js";

export const generateInventorySummary = (items: InventoryItem[], lowStock: InventoryItem[]): string => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const points: string[] = [];
  points.push(`目前共有 ${items.length} 個品項，總庫存量 ${totalQuantity} 件。`);

  if (lowStock.length === 0) {
    points.push("目前沒有低於安全庫存的品項，可維持既有補貨節奏。");
  } else {
    const lowStockText = lowStock
      .map((item) => `${item.name}(${item.quantity}/${item.reorderPoint})`)
      .join("、");
    points.push(`低庫存品項：${lowStockText}。請優先安排補貨。`);
  }

  const mostUrgent = [...lowStock].sort(
    (a, b) => a.quantity / a.reorderPoint - b.quantity / b.reorderPoint
  )[0];

  if (mostUrgent) {
    points.push(`建議先處理 ${mostUrgent.name}，並檢查儲位 ${mostUrgent.location} 的出入庫頻率。`);
  } else {
    points.push("可定期檢查高流動品項的安全庫存門檻，避免突發缺貨。");
  }

  return points.join("\n");
};
