from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from services.database import Database
from services.analytics_service import AnalyticsService
from services.recommendation_service import RecommendationService

app = Flask(__name__)
CORS(app)

DB = Database()
ANALYTICS = AnalyticsService()
RECOMMENDATION = RecommendationService()

ADMIN_CREDENTIALS = {
    "username": "chennai_district",
    "password": "Chennai@2026"
}

@app.route("/api/auth/login", methods=["POST"])
def login():
    payload = request.json or {}
    username = payload.get("username")
    password = payload.get("password")

    if username == ADMIN_CREDENTIALS["username"] and password == ADMIN_CREDENTIALS["password"]:
        return jsonify({"success": True, "message": "Login successful"})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    items = DB.fetch_inventory()
    return jsonify({"inventory": items})

@app.route("/api/inventory/<int:shop_id>", methods=["GET"])
def get_inventory_item(shop_id):
    items = DB.fetch_inventory()
    item = next((i for i in items if i["ShopID"] == shop_id), None)
    if not item:
        return jsonify({"success": False, "message": "Shop not found."}), 404
    return jsonify({"inventoryItem": item})

@app.route("/api/inventory", methods=["POST"])
def add_inventory():
    try:
        data = request.json or {}
        new_item = DB.insert_inventory(data)

        return jsonify({
            "success": True,
            "inventoryItem": new_item
        })

    except Exception:
        import traceback
        traceback.print_exc()
        raise
@app.route("/api/inventory/<int:shop_id>", methods=["PUT"])
def update_inventory(shop_id):
    data = request.json or {}

    updated_item = DB.update_inventory(shop_id, data)

    return jsonify({
        "success": True,
        "inventoryItem": updated_item
    })

@app.route("/api/inventory/<int:shop_id>", methods=["DELETE"])
def delete_inventory(shop_id):
    DB.delete_inventory(shop_id)
    return jsonify({"success": True, "message": "Shop record deleted."})

@app.route("/api/inventory/export", methods=["GET"])
def export_inventory():
    csv_text = DB.export_inventory_csv()
    return Response(
        csv_text,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory_export.csv"},
    )

@app.route("/api/analytics", methods=["GET"])
def analytics():
    inventory = DB.fetch_inventory()
    analytics_response = ANALYTICS.run_analysis(inventory)
    return jsonify(analytics_response)

@app.route("/api/recommendation", methods=["GET"])
def recommendation():
    try:
        inventory = DB.fetch_inventory()
        print("Inventory:", inventory)

        analytics_data = ANALYTICS.run_analysis(inventory)
        print("Analytics:", analytics_data)

        recommendation = RECOMMENDATION.generate(analytics_data["shops"])
        print("Recommendation:", recommendation)

        return jsonify({"recommendation": recommendation})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/approval", methods=["POST"])
def approval():
    data = request.json or {}
    decision = data.get("decision")
    if decision == "Approve":
        return jsonify({"status": "Approved", "allocationGenerated": True})
    return jsonify({"status": "Rejected", "allocationGenerated": False})

@app.errorhandler(Exception)
def handle_exception(error):
    status_code = getattr(error, "code", 500)
    response = {
        "success": False,
        "message": str(error) or "Internal server error",
    }
    return jsonify(response), status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
