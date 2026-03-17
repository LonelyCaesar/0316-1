from dataclasses import dataclass


@dataclass
class ReorderInput:
    annual_demand: int
    order_cost: float
    holding_cost: float
    lead_time_days: int
    daily_demand: int


def calculate_eoq(data: ReorderInput) -> int:
    return int(((2 * data.annual_demand * data.order_cost) / data.holding_cost) ** 0.5)


def calculate_reorder_point(data: ReorderInput) -> int:
    return data.daily_demand * data.lead_time_days


if __name__ == "__main__":
    sample = ReorderInput(
        annual_demand=12000,
        order_cost=180,
        holding_cost=25,
        lead_time_days=5,
        daily_demand=40,
    )

    print("=== Reorder Advisor Demo ===")
    print(f"EOQ: {calculate_eoq(sample)}")
    print(f"Reorder Point: {calculate_reorder_point(sample)}")
