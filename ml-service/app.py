"""
FraudGuard Mini — Flask ML Service
Serves the trained IsolationForest model via a /predict endpoint.
Expects: { amount, time, category (optional) }
"""

import os
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ── Load model + encoder at startup ────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "category_encoder.pkl")
model = None
category_encoder = None

def load_model():
    global model, category_encoder
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded from {MODEL_PATH}")
    else:
        print(f"⚠️  Model file not found at {MODEL_PATH}. Run train_model.py first!")

    if os.path.exists(ENCODER_PATH):
        category_encoder = joblib.load(ENCODER_PATH)
        print(f"✅ Category encoder loaded ({len(category_encoder.classes_)} categories)")
    else:
        print(f"⚠️  Category encoder not found. Category feature will default to 0.")


@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects JSON: { "amount": float, "time": int (0-23), "category": str (optional) }
    Returns JSON:  { "isFraud": bool, "score": float }
    """
    if model is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json(force=True)
    amount = float(data.get("amount", 0))
    time_val = float(data.get("time", 12))

    # Encode category if provided and encoder exists
    category_val = 0
    category_name = data.get("category", "")
    if category_name and category_encoder is not None:
        try:
            category_val = int(category_encoder.transform([category_name])[0])
        except (ValueError, KeyError):
            category_val = 0  # Unknown category defaults to 0

    features = np.array([[amount, time_val, category_val]])
    prediction = model.predict(features)[0]       # 1 = normal, -1 = anomaly
    score = float(model.decision_function(features)[0])

    is_fraud = prediction == -1

    return jsonify({
        "isFraud": bool(is_fraud),
        "score": round(score, 4),
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "encoder_loaded": category_encoder is not None,
    })


if __name__ == "__main__":
    load_model()
    app.run(host="0.0.0.0", port=5001, debug=True)
