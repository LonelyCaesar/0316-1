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
const backendHealthy = ref<boolean | null>(null);

const hasItems = computed(() => items.value.length > 0);

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

onMounted(loadDashboard);
</script>

<template>
  <main>
    <h1>智慧倉儲管理系統</h1>
    <button @click="loadDashboard">重新整理</button>
    <p class="status" :class="{ ok: backendHealthy, bad: backendHealthy === false }">
      後端狀態：
      <span v-if="backendHealthy === null">檢查中</span>
      <span v-else-if="backendHealthy">正常</span>
      <span v-else>異常</span>
    </p>

    <p v-if="loading">載入中...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="!loading && !hasItems" class="hint">尚未取得庫存資料。</p>

    <InventoryTable :items="items" />

    <section class="ai-box">
      <h2>補貨建議</h2>
      <p>{{ aiSummary }}</p>
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
.ai-box {
  margin-top: 20px;
  padding: 12px;
  background: #eef6ff;
  border-radius: 8px;
}
</style>
