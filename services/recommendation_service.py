class RecommendationService:
    def generate(self, shops):
        critical = [shop for shop in shops if shop["RiskLevel"] == "Critical"]
        safe = [shop for shop in shops if shop["RiskLevel"] == "Safe"]

        if not critical or not safe:
            return {
                "recommendationId": 0,
                "sourceShop": "N/A",
                "targetShop": "N/A",
                "transferAmount": 0,
                "confidence": 0,
                "reason": "Insufficient data to generate a recommendation."
            }

        target = max(critical, key=lambda shop: abs(shop["SurplusOrDeficit"]))
        source = max(safe, key=lambda shop: shop["SurplusOrDeficit"])
        transfer_amount = min(source["SurplusOrDeficit"], abs(target["SurplusOrDeficit"]), 500)
        confidence = min(100, 50 + target["PriorityScore"])

        return {
            "recommendationId": 1,
            "sourceShop": source["ShopName"],
            "targetShop": target["ShopName"],
            "transferAmount": int(transfer_amount),
            "confidence": int(confidence),
            "reason": f"{source['ShopName']} has surplus stock while {target['ShopName']} faces a predicted shortage."
        }
