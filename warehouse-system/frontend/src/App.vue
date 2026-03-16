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

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:3004";
const items = ref<Item[]>([]);
const aiSummary = ref("尚未載入");
const loading = ref(false);
const errorMessage = ref("");

const hasItems = computed(() => items.value.length > 0);

const loadDashboard = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const inventoryResponse = await fetch(`${apiBase}/api/inventory`);
    if (!inventoryResponse.ok) {
      throw new Error(`庫存 API 連線失敗（HTTP ${inventoryResponse.status}）`);
    }

    const inventoryData = (await inventoryResponse.json()) as { items?: Item[] };
    items.value = Array.isArray(inventoryData.items) ? inventoryData.items : [];

    const aiResponse = await fetch(`${apiBase}/api/ai/summary`);
    if (!aiResponse.ok) {
      const aiErrorData = (await aiResponse.json().catch(() => ({}))) as { error?: string };
      aiSummary.value = aiErrorData.error || "AI 建議暫時無法取得，請先確認 Ollama 是否啟動。";
      return;
    }

    const aiData = (await aiResponse.json()) as { summary?: string; error?: string };
    aiSummary.value = aiData.summary || aiData.error || "尚無建議";
  } catch (error) {
    const message = error instanceof Error ? error.message : "載入失敗";
    errorMessage.value = `${message}。請確認後端是否啟動於 ${apiBase}`;
    aiSummary.value = "尚未載入";
  } finally {
    loading.value = false;
  }
};

onMounted(loadDashboard);
</script>

<template>
  <main>
    <h1>智慧倉儲管理系統</h1>
    <button @click="loadDashboard">重新整理</button>
    <p v-if="loading">載入中...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="!loading && !hasItems" class="hint">尚未取得庫存資料，請依下方操作步驟啟動後端。</p>

    <InventoryTable :items="items" />

    <section class="ai-box">
      <h2>Ollama 補貨建議</h2>
      <p>{{ aiSummary }}</p>
    </section>

    <section class="ops-box">
      <h2>快速操作</h2>
      <ol>
        <li>先啟動後端 API：`cd warehouse-system/backend && npm run dev`（預設 3004）。</li>
        <li>再啟動前端：`cd warehouse-system/frontend && npm run dev`（預設 5004）。</li>
        <li>若畫面無資料，按「重新整理」，並確認 `VITE_API_BASE` 指向後端。</li>
        <li>若 Ollama 建議為空，請先啟動 Ollama 並確認 `OLLAMA_BASE_URL`。</li>
      </ol>
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
.error {
  color: #b00020;
}
.hint {
  color: #555;
}
.ai-box,
.ops-box {
  margin-top: 20px;
  padding: 12px;
  background: #eef6ff;
  border-radius: 8px;
}
.ops-box ol {
  margin: 8px 0 0 18px;
}
</style>