from datetime import date, timedelta


def calculate_thi(temperature_c: float | None, humidity_pct: float | None) -> float | None:
    if temperature_c is None or humidity_pct is None:
        return None
    return round(
        (1.8 * temperature_c + 32)
        - ((0.55 - 0.0055 * humidity_pct) * ((1.8 * temperature_c + 32) - 58)),
        2,
    )


def heat_stress_band(thi: float | None) -> str | None:
    if thi is None:
        return None
    if thi < 72:
        return "low"
    if thi < 80:
        return "mild"
    if thi < 90:
        return "moderate"
    return "severe"


def expected_calving_date(last_breeding_date: date | None) -> date | None:
    if last_breeding_date is None:
        return None
    return last_breeding_date + timedelta(days=283)


def days_open(last_calving_date: date | None, pregnancy_confirmed: bool) -> int | None:
    if last_calving_date is None or pregnancy_confirmed:
        return None
    return (date.today() - last_calving_date).days


def cost_margin(
    revenue_pkr: float | None,
    feed_cost_pkr: float | None,
    vet_cost_pkr: float | None,
    other_cost_pkr: float | None,
) -> float:
    revenue = revenue_pkr or 0.0
    costs = (feed_cost_pkr or 0.0) + (vet_cost_pkr or 0.0) + (other_cost_pkr or 0.0)
    return round(revenue - costs, 2)
