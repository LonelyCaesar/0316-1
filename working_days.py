from datetime import date, timedelta
from typing import List, Optional


def get_working_days(start_date: date, end_date: date, holidays: Optional[List[date]] = None) -> int:
    """Calculate total working days (Monday to Friday) between two dates inclusively.

    Args:
        start_date: The start date of the range.
        end_date: The end date of the range.
        holidays: Optional list of holiday dates to exclude from working days.

    Returns:
        The count of working days excluding weekends and specified holidays.

    Raises:
        ValueError: If start_date is later than end_date.
    """
    if start_date > end_date:
        raise ValueError("start_date cannot be later than end_date")

    holiday_set = set(holidays) if holidays else set()
    current_date: date = start_date
    working_days: int = 0

    while current_date <= end_date:
        if current_date.weekday() < 5 and current_date not in holiday_set:
            working_days += 1
        current_date += timedelta(days=1)

    return working_days


if __name__ == "__main__":
    try:
        start = date(2023, 10, 1)
        end = date(2023, 10, 10)
        holiday_list = [date(2023, 10, 9), date(2023, 10, 10)]

        result = get_working_days(start, end, holiday_list)
        print(f"Working days from {start} to {end}: {result}")
    except ValueError as error:
        print(f"Error: {error}")
