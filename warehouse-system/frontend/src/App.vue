<script setup lang="ts">
import { onMounted, ref } from "vue";
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

const loadDashboard = async () => {
  loading.value = true;
  const inventoryResponse = await fetch(`${apiBase}/api/inventory`);
  const inventoryData = await inventoryResponse.json();
  items.value = inventoryData.items;

  const aiResponse = await fetch(`${apiBase}/api/ai/summary`);
  const aiData = await aiResponse.json();
  aiSummary.value = aiData.summary || aiData.error || "尚無建議";
  loading.value = false;
};

onMounted(loadDashboard);
</script>

<template>
  <main>
    <h1>智慧倉儲管理系統</h1>
    <button @click="loadDashboard">重新整理</button>
    <p v-if="loading">載入中...</p>
    <InventoryTable :items="items" />

    <section class="ai-box">
      <h2>Ollama 補貨建議</h2>
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
.ai-box {
  margin-top: 20px;
  padding: 12px;
  background: #eef6ff;
  border-radius: 8px;
}
</style>
