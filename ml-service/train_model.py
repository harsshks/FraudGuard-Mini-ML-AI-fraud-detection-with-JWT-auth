"""
FraudGuard Mini — Model Training Script
Trains an IsolationForest on the Kaggle Credit Card Fraud dataset.
Dataset columns used: amt, trans_date_trans_time, category, is_fraud
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import joblib

# ── Paths ───────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "transactions.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "category_encoder.pkl")

def main():
    # 1. Load dataset
    print("📂 Loading dataset from:", DATA_PATH)
    df = pd.read_csv(DATA_PATH)
    print(f"   Loaded {len(df)} transactions  ({df['is_fraud'].sum()} labeled as fraud)")

    # 2. Feature engineering
    print("\n🔧 Engineering features...")

    # Extract hour from trans_date_trans_time
    df["trans_hour"] = pd.to_datetime(df["trans_date_trans_time"]).dt.hour

    # Encode category as numeric
    le = LabelEncoder()
    df["category_encoded"] = le.fit_transform(df["category"])

    # Save the encoder for use in prediction
    joblib.dump(le, ENCODER_PATH)
    print(f"   Categories found: {len(le.classes_)}")
    print(f"   → {list(le.classes_[:5])}{'...' if len(le.classes_) > 5 else ''}")

    # 3. Prepare features: amount, hour, category
    features = df[["amt", "trans_hour", "category_encoded"]].values
    print(f"   Feature shape: {features.shape}")

    # 4. Train IsolationForest
    contamination = df["is_fraud"].mean()
    print(f"\n🔧 Training IsolationForest  (contamination={contamination:.4f})")

    model = IsolationForest(
        n_estimators=150,
        contamination=contamination,
        max_samples="auto",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(features)

    # 5. Evaluate on training data
    predictions = model.predict(features)          # 1 = normal, -1 = anomaly
    scores = model.decision_function(features)     # lower = more anomalous

    n_anomalies = (predictions == -1).sum()
    actual_fraud = df["is_fraud"].sum()
    print(f"\n📊 Evaluation on training data:")
    print(f"   Total transactions  : {len(df)}")
    print(f"   Actual fraud labels : {actual_fraud}")
    print(f"   Detected anomalies  : {n_anomalies}")
    print(f"   Normal              : {(predictions == 1).sum()}")
    print(f"   Score range         : [{scores.min():.4f}, {scores.max():.4f}]")

    # 6. Save model
    joblib.dump(model, MODEL_PATH)
    print(f"\n✅ Model saved to: {MODEL_PATH}")
    print(f"✅ Category encoder saved to: {ENCODER_PATH}")


if __name__ == "__main__":
    main()
