<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import InventoryTable from "./components/InventoryTable.vue";

interface Item {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
  updatedAt: string;
}

interface NewItemForm {
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
}

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:3004";
const items = ref<Item[]>([]);
const aiSummary = ref("尚未載入");
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const backendHealthy = ref<boolean | null>(null);

const form = ref<NewItemForm>({
  name: "",
  sku: "",
  quantity: 0,
  reorderPoint: 0,
  location: ""
});

const hasItems = computed(() => items.value.length > 0);
const lowStockItems = computed(() => items.value.filter((item) => item.quantity <= item.reorderPoint));

const loadDashboard = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const healthResponse = await fetch(`${apiBase}/api/health`);
    backendHealthy.value = healthResponse.ok;

    const inventoryResponse = await fetch(`${apiBase}/api/inventory`);
    if (!inventoryResponse.ok) {
      throw new Error(`庫存 API 連線失敗（HTTP ${inventoryResponse.status}）`);
    }

    const inventoryData = (await inventoryResponse.json()) as { items?: Item[] };
    items.value = Array.isArray(inventoryData.items) ? inventoryData.items : [];

    const aiResponse = await fetch(`${apiBase}/api/ai/summary`);
    if (!aiResponse.ok) {
      const aiErrorData = (await aiResponse.json().catch(() => ({}))) as { error?: string };
      aiSummary.value = aiErrorData.error || "系統建議暫時無法取得。";
      return;
    }

    const aiData = (await aiResponse.json()) as { summary?: string; error?: string };
    aiSummary.value = aiData.summary || aiData.error || "尚無建議";
  } catch (error) {
    const message = error instanceof Error ? error.message : "載入失敗";
    errorMessage.value = `${message}。請確認後端是否啟動於 ${apiBase}`;
    aiSummary.value = "尚未載入";
    backendHealthy.value = false;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = { name: "", sku: "", quantity: 0, reorderPoint: 0, location: "" };
};

const createItem = async () => {
  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${apiBase}/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || `新增商品失敗（HTTP ${response.status}）`);
    }

    successMessage.value = "新增商品成功";
    resetForm();
    await loadDashboard();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "新增商品失敗";
  } finally {
    saving.value = false;
  }
};

const updateItem = async (item: Item) => {
  const name = window.prompt("品項名稱", item.name);
  if (name === null) return;
  const sku = window.prompt("SKU", item.sku);
  if (sku === null) return;
  const quantityRaw = window.prompt("庫存量", String(item.quantity));
  if (quantityRaw === null) return;
  const reorderPointRaw = window.prompt("安全庫存", String(item.reorderPoint));
  if (reorderPointRaw === null) return;
  const location = window.prompt("儲位", item.location);
  if (location === null) return;

  const quantity = Number(quantityRaw);
  const reorderPoint = Number(reorderPointRaw);

  if (!Number.isFinite(quantity) || !Number.isFinite(reorderPoint)) {
    errorMessage.value = "庫存量與安全庫存需為數字";
    return;
  }

  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${apiBase}/api/inventory/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        sku,
        quantity,
        reorderPoint,
        location
      })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || `修改商品失敗（HTTP ${response.status}）`);
    }

    successMessage.value = `${item.name} 已修改`;
    await loadDashboard();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "修改商品失敗";
  } finally {
    saving.value = false;
  }
};

const removeItem = async (item: Item) => {
  const confirmed = window.confirm(`確定刪除 ${item.name}（${item.sku}）？`);
  if (!confirmed) return;

  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${apiBase}/api/inventory/${item.id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || `刪除商品失敗（HTTP ${response.status}）`);
    }

    successMessage.value = `${item.name} 已刪除`;
    await loadDashboard();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "刪除商品失敗";
  } finally {
    saving.value = false;
  }
};

const changeStock = async (item: Item, delta: number, reason: string) => {
  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${apiBase}/api/inventory/adjust`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, delta, reason })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || `庫存更新失敗（HTTP ${response.status}）`);
    }

    successMessage.value = `${item.name} 已更新庫存`;
    await loadDashboard();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "庫存更新失敗";
  } finally {
    saving.value = false;
  }
};

const handleSell = async (item: Item, amount: number) => {
  await changeStock(item, -Math.abs(amount), "出貨");
};

const handleRestock = async (item: Item, amount: number) => {
  await changeStock(item, Math.abs(amount), "補貨");
};

const restockAllLowStock = async () => {
  for (const item of lowStockItems.value) {
    const amount = Math.max(item.reorderPoint - item.quantity, 1);
    await changeStock(item, amount, "低庫存補貨");
  }
};

onMounted(loadDashboard);
</script>

<template>
  <main>
    <h1>智慧倉儲管理系統</h1>
    <button :disabled="loading || saving" @click="loadDashboard">重新整理</button>
    <p class="status" :class="{ ok: backendHealthy, bad: backendHealthy === false }">
      後端狀態：
      <span v-if="backendHealthy === null">檢查中</span>
      <span v-else-if="backendHealthy">正常</span>
      <span v-else>異常</span>
    </p>

    <p v-if="loading">載入中...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="ok">{{ successMessage }}</p>
    <p v-if="!loading && !hasItems" class="hint">尚未取得庫存資料。</p>

    <section class="ops-box">
      <h2>新增商品</h2>
      <div class="form-grid">
        <input v-model="form.name" placeholder="品項名稱" />
        <input v-model="form.sku" placeholder="SKU" />
        <input v-model.number="form.quantity" type="number" min="0" placeholder="初始庫存" />
        <input v-model.number="form.reorderPoint" type="number" min="0" placeholder="安全庫存" />
        <input v-model="form.location" placeholder="儲位" />
        <button :disabled="saving" @click="createItem">新增商品</button>
      </div>
    </section>

    <InventoryTable
      :items="items"
      :busy="saving"
      @sell="handleSell"
      @restock="handleRestock"
      @edit="updateItem"
      @delete="removeItem"
    />

    <section class="ai-box">
      <h2>補貨建議</h2>
      <p>{{ aiSummary }}</p>
      <button :disabled="saving || lowStockItems.length === 0" @click="restockAllLowStock">
        一鍵補齊低庫存（{{ lowStockItems.length }} 項）
      </button>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 960px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
h1 {
  color: #1f3a5f;
}
button {
  margin: 10px 0;
  padding: 8px 12px;
}
.status {
  font-weight: 600;
}
.ok {
  color: #0f7a33;
}
.bad {
  color: #b00020;
}
.error {
  color: #b00020;
}
.hint {
  color: #555;
}
.ops-box,
.ai-box {
  margin-top: 20px;
  padding: 12px;
  background: #eef6ff;
  border-radius: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.form-grid input {
  padding: 8px;
}
</style>
