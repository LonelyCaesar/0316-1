<script setup lang="ts">
interface Item {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  location: string;
  updatedAt: string;
}

defineProps<{
  items: Item[];
  busy?: boolean;
}>();

const emit = defineEmits<{
  sell: [item: Item, amount: number];
  restock: [item: Item, amount: number];
  edit: [item: Item];
  delete: [item: Item];
}>();

const onSellOne = (item: Item) => {
  emit("sell", item, 1);
};

const onRestock = (item: Item) => {
  const amount = Math.max(item.reorderPoint - item.quantity, 1);
  emit("restock", item, amount);
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>品項</th>
        <th>SKU</th>
        <th>庫存量</th>
        <th>安全庫存</th>
        <th>儲位</th>
        <th>更新時間</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id" :class="{ low: item.quantity <= item.reorderPoint }">
        <td>{{ item.name }}</td>
        <td>{{ item.sku }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.reorderPoint }}</td>
        <td>{{ item.location }}</td>
        <td>{{ new Date(item.updatedAt).toLocaleString() }}</td>
        <td class="actions">
          <button :disabled="busy || item.quantity <= 0" @click="onSellOne(item)">賣出 1</button>
          <button :disabled="busy || item.quantity > item.reorderPoint" @click="onRestock(item)">補到安全庫存</button>
          <button :disabled="busy" @click="emit('edit', item)">修改</button>
          <button :disabled="busy" @click="emit('delete', item)">刪除</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
.low {
  background: #ffe5e5;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
button {
  padding: 4px 8px;
}
</style>
