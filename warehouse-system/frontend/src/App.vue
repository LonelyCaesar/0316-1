<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type Item = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
};

type Suggestion = {
  itemId: string;
  name: string;
  suggestedOrder: number;
};

const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:3004';
const inventory = ref<Item[]>([]);
const suggestions = ref<Suggestion[]>([]);

const form = ref({ name: '', sku: '', quantity: 0, reorderPoint: 0, location: '' });

const lowStockCount = computed(() => inventory.value.filter((item) => item.quantity <= item.reorderPoint).length);

async function refresh() {
  const [inventoryResponse, summaryResponse] = await Promise.all([
    fetch(`${apiBase}/api/inventory`).then((res) => res.json()),
    fetch(`${apiBase}/api/ai/summary`).then((res) => res.json())
  ]);
  inventory.value = inventoryResponse;
  suggestions.value = summaryResponse.suggestions;
}

async function sellOne(itemId: string) {
  await fetch(`${apiBase}/api/inventory/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, delta: -1, reason: 'sale' })
  });
  await refresh();
}

async function restock(item: Item) {
  const delta = Math.max(item.reorderPoint - item.quantity, 0);
  if (!delta) return;
  await fetch(`${apiBase}/api/inventory/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: item.id, delta, reason: 'restock to reorder point' })
  });
  await refresh();
}


async function removeItem(item: Item) {
  if (!window.confirm(`確定要刪除「${item.name}」嗎？`)) {
    return;
  }
  await fetch(`${apiBase}/api/inventory/${item.id}`, {
    method: 'DELETE'
  });
  await refresh();
}

async function addItem() {
  await fetch(`${apiBase}/api/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });
  form.value = { name: '', sku: '', quantity: 0, reorderPoint: 0, location: '' };
  await refresh();
}

onMounted(refresh);
</script>

<template>
  <main>
    <h1>智慧倉儲管理系統（簡易版）</h1>
    <p>總品項：{{ inventory.length }} ｜ 低庫存：{{ lowStockCount }}</p>

    <section>
      <h2>新增商品</h2>
      <div class="grid">
        <input v-model="form.name" placeholder="品項名稱" />
        <input v-model="form.sku" placeholder="SKU" />
        <input v-model.number="form.quantity" type="number" placeholder="初始庫存" />
        <input v-model.number="form.reorderPoint" type="number" placeholder="安全庫存" />
        <input v-model="form.location" placeholder="儲位" />
        <button @click="addItem">新增商品</button>
      </div>
    </section>

    <section>
      <h2>庫存列表</h2>
      <table>
        <thead>
          <tr><th>名稱</th><th>SKU</th><th>庫存</th><th>安全庫存</th><th>儲位</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.id" :class="{ danger: item.quantity <= item.reorderPoint }">
            <td>{{ item.name }}</td>
            <td>{{ item.sku }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.reorderPoint }}</td>
            <td>{{ item.location }}</td>
            <td>
              <button @click="sellOne(item.id)">賣出 1</button>
              <button @click="restock(item)">補到安全庫存</button>
              <button @click="removeItem(item)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>補貨建議</h2>
      <ul>
        <li v-for="s in suggestions" :key="s.itemId">{{ s.name }}：建議補貨 {{ s.suggestedOrder }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
main { max-width: 960px; margin: 0 auto; font-family: Arial, sans-serif; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; margin-bottom: 16px; }
input, button { padding: 8px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
.danger { background: #ffe8e8; }
</style>
