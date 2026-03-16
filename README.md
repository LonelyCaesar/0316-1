# Warehouse System Demo (Python + Vue 3 + TypeScript + Node.js + Ollama)

這個 repo 新增了一個可快速啟動的「智慧倉儲系統」範例，包含：

- **Node.js + TypeScript 後端 API**（庫存查詢、調整、低庫存、AI 建議）
- **Vue 3 + TypeScript 前端儀表板**（庫存列表與 Ollama 建議）
- **Python 補貨計算模組**（EOQ 與 Reorder Point）
- **Ollama 整合**（透過 `/api/chat` 取得文字建議）

---

## 目錄

```text
warehouse-system/
  backend/   # Express + TS API
  frontend/  # Vue3 + TS dashboard
  python/    # 補貨決策 Python 函式
```

---

## 1) 啟動後端

```bash
cd warehouse-system/backend
npm install
npm run dev
```

預設 `http://localhost:3000`。

### 主要 API

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`（呼叫 Ollama）

你可用環境變數覆蓋設定：

- `OLLAMA_BASE_URL`（預設 `http://localhost:11434`）
- `OLLAMA_MODEL`（預設 `llama3.1`）

---

## 2) 啟動前端

```bash
cd warehouse-system/frontend
npm install
npm run dev
```

預設 `http://localhost:5173`。

可使用：

```bash
VITE_API_BASE=http://localhost:3000 npm run dev
```

---

## 3) Python 補貨邏輯

```bash
python3 warehouse-system/python/reorder_advisor.py
```

會輸出 EOQ 與 ROP 的範例數值，方便接入 ERP/WMS 邏輯。

---

## 4) 測試

後端單元測試：

```bash
cd warehouse-system/backend
npm test
```

Python smoke test：

```bash
python3 warehouse-system/python/reorder_advisor.py
```
