# 智慧倉儲系統（warehouse-system）

本專案目錄：`/workspace/0316-1`。

系統分成三塊：
- 後端 API：`warehouse-system/backend`（Node.js + TypeScript）
- 前端畫面：`warehouse-system/frontend`（Vue 3 + TypeScript）
- Python 補貨計算：`warehouse-system/python/reorder_advisor.py`

預設網址：
- 前端：`http://localhost:5004`
- 後端：`http://localhost:3004`


## 0. 衝突檔案已統一版本

本次 PR 若看到 3 個衝突檔，請以目前分支內容為準：
- `README.md`：本文件（以絕對路徑指令為準）
- `warehouse-system/backend/src/server.ts`：預設後端埠號 `3004`
- `warehouse-system/frontend/src/App.vue`：快速操作改為絕對路徑，並含 404 排錯

---

## 1. 直接啟動（照順序）

### 終端機 A：啟動後端
> 先切到 repo 根目錄再執行

```bash
cd /workspace/0316-1
cd warehouse-system/backend
npm install
npm run dev
```

成功訊息應包含：`Warehouse API running at http://localhost:3004`

### 終端機 B：啟動前端

```bash
cd /workspace/0316-1
cd warehouse-system/frontend
npm install
npm run dev
```

瀏覽器開：`http://localhost:5004`

## 2. 常見問題（對應你圖中的狀況）

### Q1: 畫面有資料，但「Ollama 補貨建議」顯示 `Ollama request failed with status 404`
代表前端與後端已正常，但後端打到的 Ollama API 路徑/服務不對。

處理方式：
1. 先啟動 Ollama：
   ```bash
   ollama serve
   ```
2. 確認後端環境變數（在啟動 backend 的同一個終端機）：
   ```bash
   export OLLAMA_BASE_URL=http://localhost:11434
   export OLLAMA_MODEL=llama3.1
   npm run dev
   ```

### Q2: 前端一直載入中或沒資料
1. 檢查後端是否真的在 `http://localhost:3004`。
2. 檢查前端是否開在 `http://localhost:5004`（不是 5173）。
3. 如需手動指定 API：
   ```bash
   cd /workspace/0316-1/warehouse-system/frontend
   VITE_API_BASE=http://localhost:3004 npm run dev
   ```

## 3. API 一覽（後端）

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`

## 4. Python 補貨計算

```bash
cd /workspace/0316-1
python3 warehouse-system/python/reorder_advisor.py
```

## 5. 測試指令

### 後端測試
```bash
cd /workspace/0316-1/warehouse-system/backend
npm test
```

### Python 語法檢查
```bash
cd /workspace/0316-1
python3 -m py_compile warehouse-system/python/reorder_advisor.py
```
