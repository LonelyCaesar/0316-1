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

defineProps<{ items: Item[] }>();
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
</style>
