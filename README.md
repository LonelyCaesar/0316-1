cat << 'EOF' > README.md
# Warehouse System Demo (Python + Vue 3 + TypeScript + Node.js + Ollama)

這個 repo 新增了一個可快速啟動的「智慧倉儲系統」範例，包含：

- **Node.js + TypeScript 後端 API**（庫存查詢、調整、低庫存、AI 建議）
- **Vue 3 + TypeScript 前端儀表板**（庫存列表與 Ollama 建議）
- **Python 補貨計算模組**（EOQ 與 Reorder Point）
- **Ollama 整合**（透過 `/api/chat` 取得文字建議）

預設網址：前端 `http://localhost:5004`、後端 `http://localhost:3004`。

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

預設 `http://localhost:3004`。

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

預設 `http://localhost:5004`。

可使用：

```bash
VITE_API_BASE=http://localhost:3004 npm run dev
```

---

## 常見操作（對應你看到的畫面）

如果頁面停在「載入中…」或顯示「尚未載入」，通常是前端連不到後端或 Ollama。

1. 開兩個終端機。
2. 終端機 A 啟動後端：
   ```bash
   cd warehouse-system/backend
   npm install
   npm run dev
   ```
   看到 `Warehouse API running at http://localhost:3004` 代表成功。
3. 終端機 B 啟動前端：
   ```bash
   cd warehouse-system/frontend
   npm install
   npm run dev
   ```
   瀏覽器開 `http://localhost:5004`。
4. 如果你是開在 `http://localhost:5173`，請改成 `5004`，或重啟前端後以終端顯示網址為準。
5. 若只想先看庫存，不需 Ollama；若要 AI 建議，另開 Ollama：
   ```bash
   ollama serve
   ```

---

## PR 衝突處理（不能點 Resolve conflicts 時）

如果 PR 頁面顯示 `This branch has conflicts that must be resolved`，但你無法在 GitHub 直接點 `Resolve conflicts`，請改用本機 Git：

```bash
git fetch origin
git checkout <your-pr-branch>
git merge origin/<target-branch>
# 手動修改衝突檔（刪除 <<<<<<<、=======、>>>>>>>）
git add .
git commit -m "resolve merge conflicts"
git push origin <your-pr-branch>
```

完成後回到 PR 頁面，`Merge pull request` 通常就會恢復可點擊。

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
EOF