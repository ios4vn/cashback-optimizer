import json
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

with open("data/cards.json", encoding="utf-8") as f:
    CARDS = json.load(f)

CARDS_MAP = {c["id"]: c for c in CARDS}

CATEGORIES = [
    {"id": "dining", "label": "Ăn uống", "icon": "🍜"},
    {"id": "online", "label": "Mua sắm online", "icon": "🛒"},
    {"id": "supermarket", "label": "Siêu thị", "icon": "🏪"},
    {"id": "fuel", "label": "Xăng dầu", "icon": "⛽"},
    {"id": "travel", "label": "Du lịch", "icon": "✈️"},
    {"id": "hotel", "label": "Khách sạn", "icon": "🏨"},
    {"id": "taxi", "label": "Taxi & Di chuyển", "icon": "🚕"},
    {"id": "entertainment", "label": "Giải trí & Streaming", "icon": "🎬"},
    {"id": "healthcare", "label": "Y tế", "icon": "🏥"},
    {"id": "education", "label": "Giáo dục", "icon": "📚"},
    {"id": "other", "label": "Khác", "icon": "💳"},
]


def get_rate_and_cap(card, category):
    """Get cashback rate and monthly cap for a card+category."""
    for rule in card["cashback_rules"]:
        if rule["category"] == category:
            return rule["rate"], rule.get("cap_monthly")
    # "custom" category cards (VIB SuperCard, Techcombank Spark, etc.)
    # apply their custom rate to any category the user asks about
    for rule in card["cashback_rules"]:
        if rule["category"] == "custom":
            return rule["rate"], rule.get("cap_monthly")
    # fallback to "other"
    for rule in card["cashback_rules"]:
        if rule["category"] == "other":
            return rule["rate"], rule.get("cap_monthly")
    return 0, None


def recommend(amount, category, my_card_ids, month_usage):
    """Recommend best card for a transaction, considering used caps."""
    results = []
    for card_id in my_card_ids:
        card = CARDS_MAP.get(card_id)
        if not card:
            continue
        rate, cap = get_rate_and_cap(card, category)
        raw_cashback = amount * rate / 100
        used = month_usage.get(card_id, {}).get(category, 0)
        if cap is not None:
            remaining_cap = max(0, cap - used)
            cashback = min(raw_cashback, remaining_cap)
        else:
            cap = 0  # unlimited
            remaining_cap = 0
            cashback = raw_cashback
        results.append({
            "card_id": card_id,
            "card_name": card["name"],
            "bank": card["bank"],
            "rate": rate,
            "cashback": round(cashback),
            "cap_total": cap,
            "cap_used": round(used),
            "cap_remaining": round(remaining_cap) if cap else None,
            "is_unlimited": cap == 0,
        })
    results.sort(key=lambda x: x["cashback"], reverse=True)
    return results


@app.route("/")
def index():
    return render_template("index.html", categories=CATEGORIES)


@app.route("/card/<card_id>")
def card_detail(card_id):
    card = CARDS_MAP.get(card_id)
    if not card:
        return "Không tìm thấy thẻ", 404
    return render_template("card.html", card=card)


@app.route("/api/cards")
def api_cards():
    return jsonify(CARDS)


@app.route("/api/categories")
def api_categories():
    return jsonify(CATEGORIES)


@app.route("/api/recommend", methods=["POST"])
def api_recommend():
    data = request.get_json()
    amount = data.get("amount", 0)
    category = data.get("category", "other")
    my_cards = data.get("my_cards", [])
    month_usage = data.get("month_usage", {})
    if not my_cards:
        my_cards = [c["id"] for c in CARDS]
    results = recommend(amount, category, my_cards, month_usage)
    return jsonify({"recommendations": results})


if __name__ == "__main__":
    app.run(debug=True, port=5050)
