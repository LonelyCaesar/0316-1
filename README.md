# Warehouse System Demo (Python + Vue 3 + TypeScript + Node.js)

這是一個「**智慧倉儲管理系統簡易實作**」範例，包含：

- Node.js + TypeScript 後端 API（庫存查詢、調整、新增、低庫存與補貨建議）
- Vue 3 + TypeScript 前端儀表板（商品列表、新增商品、賣出與補貨操作）
- Python 補貨計算模組（EOQ + Reorder Point）

預設網址：

- 前端 `http://localhost:5004`
- 後端 `http://localhost:3004`

## 專案結構

```text
warehouse-system/
  backend/   # Express + TypeScript API
  frontend/  # Vue3 + TypeScript dashboard
  python/    # 補貨決策 Python 函式
```

## 快速啟動

請開 2 個終端機：

### 終端機 A（後端）

```bash
cd warehouse-system/backend
npm install
npm run dev
```

健康檢查：`http://localhost:3004/api/health`

### 終端機 B（前端）

```bash
cd warehouse-system/frontend
npm install
VITE_API_BASE=http://localhost:3004 npm run dev
```

開啟：`http://localhost:5004`

## 主要 API

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`

## Python 補貨邏輯

```bash
python3 warehouse-system/python/reorder_advisor.py
```

## 測試

```bash
cd warehouse-system/backend
npm test
```
