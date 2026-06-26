import pandas as pd

class AnalyticsService:
    def run_analysis(self, inventory_list):
        df = pd.DataFrame(inventory_list)
        if df.empty:
            return {"shops": [], "summary": {"totalShops": 0, "totalInventory": 0, "criticalAlerts": 0, "predictedShortages": 0}}

        df["forecastDemand"] = (df["MonthlyDemand"] * 1.05).round().astype(int)
        df["surplusOrDeficit"] = df["CurrentStock"] - df["forecastDemand"]
        df["riskLevel"] = df["surplusOrDeficit"].apply(self._risk_level)
        df["priorityScore"] = df["surplusOrDeficit"].apply(self._priority_score)

        shops = []
        for _, row in df.iterrows():
            shops.append({
                "ShopID": int(row["ShopID"]),
                "ShopName": row["ShopName"],
                "ForecastDemand": int(row["forecastDemand"]),
                "CurrentStock": int(row["CurrentStock"]),
                "SurplusOrDeficit": int(row["surplusOrDeficit"]),
                "RiskLevel": row["riskLevel"],
                "PriorityScore": int(row["priorityScore"]),
            })

        summary = {
            "totalShops": int(df.shape[0]),
            "totalInventory": int(df["CurrentStock"].sum()),
            "criticalAlerts": int((df["riskLevel"] == "Critical").sum()),
            "predictedShortages": int((df["surplusOrDeficit"] < 0).sum()),
        }

        return {"shops": shops, "summary": summary}

    def _risk_level(self, surplus_or_deficit):
        if surplus_or_deficit < -300:
            return "Critical"
        if surplus_or_deficit < 0:
            return "High"
        if surplus_or_deficit < 200:
            return "Moderate"
        return "Safe"

    def _priority_score(self, surplus_or_deficit):
        return min(100, max(1, abs(int(surplus_or_deficit)) // 5))
