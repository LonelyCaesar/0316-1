# Working Days Calculator

這個專案提供一個 Python 函式 `get_working_days`，用來計算兩個日期（含起訖日）之間的工作日總天數（週一到週五），並可自動扣除指定假日。

另外也新增了兩支可直接執行的 Python 測試腳本，用來驗證私人網站常見架構：
- 前端 Vue.js
- 後端 Node.js

## 函式簽名

```python
def get_working_days(start_date: date, end_date: date, holidays: Optional[List[date]] = None) -> int
```

## 功能說明

- 檢查日期區間是否合法：若 `start_date > end_date`，會拋出 `ValueError`。
- 使用 `while` 迴圈與 `timedelta(days=1)` 逐日遞增。
- 以 `weekday() < 5` 判斷是否為平日（週一至週五）。
- 若有提供 `holidays`，會先轉成 `set`，讓假日查詢維持 O(1) 平均時間複雜度。

## 使用範例

```python
from datetime import date
from working_days import get_working_days

start = date(2023, 10, 1)
end = date(2023, 10, 10)
holidays = [date(2023, 10, 9), date(2023, 10, 10)]

print(get_working_days(start, end, holidays))
# 預期輸出: 5
```

## 直接執行測試

```bash
python3 working_days.py
```

預期輸出：

```text
Working days from 2023-10-01 to 2023-10-10: 5
```

---

## 私人網站測試腳本（Python）

### 安裝依賴

不需要額外第三方套件（使用 Python 標準函式庫 `urllib`）。

### 1) Vue.js 前端 Smoke Test

檔案：`scripts/test_frontend_vue.py`

範例：

```bash
python3 scripts/test_frontend_vue.py \
  --url http://localhost:5173 \
  --mount-selector 'id="app"' \
  --expect-text '歡迎'
```

預設會檢查：
- 頁面可連線且回應 2xx
- HTML 中是否包含 Vue 掛載點（預設 `id="app"`）
- （可選）是否包含指定文字

### 2) Node.js 後端 Smoke Test

檔案：`scripts/test_backend_node.py`

範例：

```bash
python3 scripts/test_backend_node.py \
  --base-url http://localhost:3000 \
  --health-path /api/health \
  --expect-status ok
```

預設會檢查：
- Health API 可連線且回應 2xx
- 回應為 JSON
- JSON 中 `status` 欄位符合預期值（預設 `ok`）
