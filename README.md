# Warehouse System Demo (Python + Vue 3 + TypeScript + Node.js + Ollama)

這個 repo 提供一個可快速啟動的「智慧倉儲系統」範例，包含：

- **Node.js + TypeScript 後端 API**（庫存查詢、調整、低庫存、AI 建議）
- **Vue 3 + TypeScript 前端儀表板**（庫存列表與 Ollama 建議）
- **Python 補貨計算模組**（EOQ 與 Reorder Point）
- **Ollama 整合**（透過 `/api/ai/summary` 取得文字建議）

預設網址：前端 `http://localhost:5004`、後端 `http://localhost:3004`。

## 專案結構

```text
warehouse-system/
  backend/   # Express + TS API
  frontend/  # Vue3 + TS dashboard
  python/    # 補貨決策 Python 函式
```

## 1) 啟動後端

```bash
cd warehouse-system/backend
npm install
npm run dev
```

預設 `http://localhost:3004`。

### 主要 API

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`

可用環境變數覆蓋：

- `PORT`（預設 `3004`）
- `HOST`（預設 `0.0.0.0`）
- `OLLAMA_BASE_URL`（預設 `http://localhost:11434`）
- `OLLAMA_MODEL`（預設 `llama3.1`）

## 2) 啟動前端

```bash
cd warehouse-system/frontend
npm install
npm run dev
```

預設 `http://localhost:5004`。

可指定 API Base：

```bash
VITE_API_BASE=http://localhost:3004 npm run dev
```

## 常見排查

若頁面顯示「載入中...」或「尚未取得庫存資料」：

1. 確認後端已啟動且可開啟 `http://localhost:3004/api/health`。
2. 確認前端啟動網址為 `http://localhost:5004`。
3. 若要顯示 AI 建議，另開一個終端啟動 Ollama：

```bash
ollama serve
```

## 3) Python 補貨邏輯

```bash
python3 warehouse-system/python/reorder_advisor.py
```

## 4) 測試

```bash
cd warehouse-system/backend
npm test
```
