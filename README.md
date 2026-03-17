# Warehouse System Demo (Python + Vue 3 + TypeScript + Node.js)

這個 repo 提供一個可快速啟動的「智慧倉儲系統」範例，包含：

- **Node.js + TypeScript 後端 API**（庫存查詢、調整、低庫存、補貨建議）
- **Vue 3 + TypeScript 前端儀表板**（庫存列表與補貨建議）
- **Python 補貨計算模組**（EOQ 與 Reorder Point）

預設網址：前端 `http://localhost:5004`、後端 `http://localhost:3004`。

---

## 專案結構

```text
warehouse-system/
  backend/   # Express + TS API
  frontend/  # Vue3 + TS dashboard
  python/    # 補貨決策 Python 函式
```

---

## 先看這段：要開幾個終端機？

請開 **2 個終端機視窗（或 2 個分頁）**：

- **終端機 A（後端專用）**：啟動 API（port 3004）
- **終端機 B（前端專用）**：啟動前端頁面（port 5004）

> `npm test` 只會跑測試，不會啟動後端服務。

---

## 1) 終端機 A：啟動後端 API

### Windows PowerShell / CMD

```powershell
cd <你的專案路徑>\warehouse-system\backend
npm install
npm run dev
```

啟動成功後可測試：

- `http://localhost:3004/api/health`

---
啟動成功後可測試：

- `http://localhost:3004/api/health`

---
- `PORT`（預設 `3004`）
- `HOST`（預設 `0.0.0.0`）

## 2) 終端機 B：啟動前端

### Windows PowerShell

```powershell
cd <你的專案路徑>\warehouse-system\frontend
npm install
$env:VITE_API_BASE="http://localhost:3004"
npm run dev
```

### Windows CMD

```cmd
cd <你的專案路徑>\warehouse-system\frontend
npm install
set VITE_API_BASE=http://localhost:3004&& npm run dev
```

```cmd
cd <你的專案路徑>\warehouse-system\frontend
npm install
set VITE_API_BASE=http://localhost:3004&& npm run dev
```

啟動後打開：

- `http://localhost:5004`

---

## 網頁操作：新增商品、賣出自動扣庫存、低庫存補貨

1. 開啟 `http://localhost:5004`。
2. 在「新增商品」區塊填入 `品項名稱 / SKU / 初始庫存 / 安全庫存 / 儲位`，按「新增商品」。
3. 在庫存表每列可按「賣出 1」，系統會自動扣減該品項庫存。
4. 若品項低於安全庫存，可按該列「補到安全庫存」。
5. 也可在「補貨建議」區按「一鍵補齊低庫存」，自動補齊所有低庫存品項。

> 表格紅底代表低庫存（`庫存量 <= 安全庫存`）。

---

## 進出貨與新增商品（重點）

### A. 賣出商品（扣庫存）

使用 `POST /api/inventory/adjust`，`delta` 填負數：

```bash
curl -X POST http://localhost:3004/api/inventory/adjust \
  -H "Content-Type: application/json" \
  -d '{"itemId":"1","delta":-5,"reason":"出貨"}'
```

### B. 新增一個新商品（新 SKU）

使用 `POST /api/inventory`：

```bash
curl -X POST http://localhost:3004/api/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"防塵口罩","sku":"MSK-004","quantity":30,"reorderPoint":20,"location":"D-01"}'
```

Windows PowerShell 範例：

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3004/api/inventory" -ContentType "application/json" -Body '{"name":"防塵口罩","sku":"MSK-004","quantity":30,"reorderPoint":20,"location":"D-01"}'
```

啟動後打開：

- `http://localhost:5004`

---

## 進出貨與新增商品（重點）

### A. 賣出商品（扣庫存）

使用 `POST /api/inventory/adjust`，`delta` 填負數：

```bash
curl -X POST http://localhost:3004/api/inventory/adjust \
  -H "Content-Type: application/json" \
  -d '{"itemId":"1","delta":-5,"reason":"出貨"}'
```

### B. 新增一個新商品（新 SKU）

使用 `POST /api/inventory`：

```bash
curl -X POST http://localhost:3004/api/inventory \
  -H "Content-Type: application/json" \
  -d '{"name":"防塵口罩","sku":"MSK-004","quantity":30,"reorderPoint":20,"location":"D-01"}'
```

## 主要 API

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`

可用環境變數覆蓋（後端）：

- `PORT`（預設 `3004`）
- `HOST`（預設 `0.0.0.0`）

---

## 常見排查

1. **前端顯示無資料 / Failed to fetch**
   - 先檢查終端機 A 是否還在跑 `npm run dev`。
   - 確認 `http://localhost:3004/api/health` 打得開。

2. **Windows 出現 `ENOENT ... package.json`**
   - 代表你在錯誤目錄（常見：`C:\WINDOWS\System32`）執行 npm。
   - 請先 `cd` 到正確資料夾：
     - 後端：`...\warehouse-system\backend`
     - 前端：`...\warehouse-system\frontend`

3. **PowerShell 顯示 `'VITE_API_BASE=...' is not recognized`**
   - 你用了 bash 語法。
   - PowerShell 請改用：
     - `$env:VITE_API_BASE="http://localhost:3004"`
     - 然後再 `npm run dev`

---
1. 確認後端已啟動且可開啟 `http://localhost:3004/api/health`。
2. 確認前端啟動網址為 `http://localhost:5004`。

Windows PowerShell 範例：

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3004/api/inventory" -ContentType "application/json" -Body '{"name":"防塵口罩","sku":"MSK-004","quantity":30,"reorderPoint":20,"location":"D-01"}'
```

新增後重新整理前端頁面即可看到新商品。

---

## 主要 API

- `GET /api/health`
- `GET /api/inventory`
- `POST /api/inventory`（新增商品）
- `POST /api/inventory/adjust`
- `GET /api/inventory/low-stock`
- `GET /api/ai/summary`

可用環境變數覆蓋（後端）：

- `PORT`（預設 `3004`）
- `HOST`（預設 `0.0.0.0`）

---

## 常見排查

1. **前端顯示無資料 / Failed to fetch**
   - 先檢查終端機 A 是否還在跑 `npm run dev`。
   - 確認 `http://localhost:3004/api/health` 打得開。

2. **Windows 出現 `ENOENT ... package.json`**
   - 代表你在錯誤目錄（常見：`C:\WINDOWS\System32`）執行 npm。
   - 請先 `cd` 到正確資料夾：
     - 後端：`...\warehouse-system\backend`
     - 前端：`...\warehouse-system\frontend`

3. **PowerShell 顯示 `'VITE_API_BASE=...' is not recognized`**
   - 你用了 bash 語法。
   - PowerShell 請改用：
     - `$env:VITE_API_BASE="http://localhost:3004"`
     - 然後再 `npm run dev`

---

## 3) Python 補貨邏輯

```bash
python3 warehouse-system/python/reorder_advisor.py
```

---

## 4) 測試（只跑測試，不會啟動服務）

```bash
cd warehouse-system/backend
npm test
```
