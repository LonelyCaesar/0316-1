# Working Days Calculator

這個專案提供一個 Python 函式 `get_working_days`，用來計算兩個日期（含起訖日）之間的工作日總天數（週一到週五），並可自動扣除指定假日。

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
