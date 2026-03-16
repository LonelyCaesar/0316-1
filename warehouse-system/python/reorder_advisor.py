from dataclasses import dataclass
from math import sqrt


@dataclass
class ReorderInput:
    annual_demand: int
    ordering_cost: float
    holding_cost: float
    lead_time_days: int
    daily_demand: float
    safety_stock: int


def economic_order_quantity(data: ReorderInput) -> int:
    """回傳 EOQ（經濟訂購量）。"""
    if data.annual_demand <= 0:
        raise ValueError("annual_demand must be positive")
    if data.ordering_cost <= 0 or data.holding_cost <= 0:
        raise ValueError("ordering_cost and holding_cost must be positive")

    eoq = sqrt((2 * data.annual_demand * data.ordering_cost) / data.holding_cost)
    return int(round(eoq))


def reorder_point(data: ReorderInput) -> int:
    """回傳再訂購點 = 前置天數需求 + 安全庫存。"""
    if data.lead_time_days < 0:
        raise ValueError("lead_time_days cannot be negative")

    return int(round((data.daily_demand * data.lead_time_days) + data.safety_stock))


if __name__ == "__main__":
    sample = ReorderInput(
        annual_demand=12000,
        ordering_cost=500,
        holding_cost=25,
        lead_time_days=7,
        daily_demand=40,
        safety_stock=120,
    )
    print("EOQ:", economic_order_quantity(sample))
    print("ROP:", reorder_point(sample))
