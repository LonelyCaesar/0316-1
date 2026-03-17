# Warehouse System Demo (Python + Vue 3 + TypeScript + Node.js)

這是一個「**智慧倉儲管理系統簡易實作**」範例，包含：

- Node.js + TypeScript 後端 API（庫存查詢、調整、新增、刪除、低庫存與補貨建議）
- Vue 3 + TypeScript 前端儀表板（商品列表、新增商品、賣出、補貨、刪除）
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

#### macOS / Linux / Git Bash

```bash
cd warehouse-system/frontend
npm install
VITE_API_BASE=http://localhost:3004 npm run dev
```

#### Windows PowerShell

```powershell
cd warehouse-system/frontend
npm install
$env:VITE_API_BASE="http://localhost:3004"
npm run dev
```

#### Windows CMD

```cmd
cd warehouse-system\frontend
npm install
set VITE_API_BASE=http://localhost:3004&& npm run dev
```

開啟：`http://localhost:5004`

## 前端操作

- 在「新增商品」區塊可新增一筆商品。
- 在庫存列表可操作：
  - 「賣出 1」：扣減庫存。
  - 「補到安全庫存」：補貨到安全庫存值。
  - 「刪除」：刪除該商品。

## 主要 API

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory`
- `DELETE /api/inventory/:itemId`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`

刪除商品範例：

```bash
curl -X DELETE http://localhost:3004/api/inventory/2
```

## Python 補貨邏輯

```bash
python3 warehouse-system/python/reorder_advisor.py
```

## 測試

```bash
cd warehouse-system/backend
npm test
```
