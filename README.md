<div align="center">

# 🛡️ FraudGuard Mini

### Real-Time Fraud Detection Platform

**Hybrid ML + Generative AI** transaction fraud analysis with JWT authentication

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

</div>

---

## 📌 Overview

FraudGuard Mini is a **full-stack fraud detection platform** that combines **unsupervised machine learning** (IsolationForest) with **Google Gemini AI** to detect and explain suspicious financial transactions in real time.

**The Problem:** Financial fraud costs billions annually. Traditional rule-based systems fail to catch novel fraud patterns and provide no human-readable explanations.

**The Solution:** A hybrid approach — ML catches anomalies that rules miss, while generative AI provides natural language explanations of *why* a transaction was flagged. Real-time Socket.io updates keep dashboards live, and JWT auth ensures per-user data isolation.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **Hybrid ML + AI Pipeline** | IsolationForest anomaly detection + Gemini 2.0 Flash explanations |
| 🔐 **JWT Authentication** | Secure sign-up, login, user profiles with bcrypt password hashing |
| ⚡ **Real-Time Updates** | Socket.io pushes new transactions and deletions to all connected clients |
| 📊 **Analytics Dashboard** | Interactive charts (Recharts) — pie, bar, and area charts for fraud trends |
| 📄 **PDF Reports** | Generate downloadable fraud analysis reports with selective transaction export |
| 🔒 **Per-User Data Isolation** | Each user only sees and manages their own transactions |
| 📱 **Responsive Design** | Premium dark theme with glass-morphism, works on all screen sizes |
| 🏷️ **Category Classification** | 14 transaction categories for more granular fraud analysis |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌────────────────┐
│   React +   │────▶│   Express.js    │────▶│  Python Flask   │
│  Tailwind   │◀────│   REST API      │◀────│  ML Service     │
│  (Vite)     │     │  + Socket.io    │     │  IsolationForest│
└─────────────┘     └────────┬────────┘     └────────────────┘
                             │
                    ┌────────┴────────┐
                    │   MongoDB Atlas  │
                    │   (Users + Txns) │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │  Google Gemini   │
                    │  2.0 Flash API   │
                    └─────────────────┘
```

**Data Flow:**
1. **React** submits transaction → **Express** receives it
2. Express forwards to **Python ML service** → IsolationForest scores anomaly
3. If suspicious, Express sends to **Gemini AI** → generates human-readable explanation
4. Result saved to **MongoDB**, broadcast via **Socket.io** to all clients

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Tailwind CSS 4, Vite 7, Recharts, React Router |
| **Backend** | Node.js, Express.js, Socket.io, PDFKit |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **ML Service** | Python, Flask, scikit-learn (IsolationForest) |
| **AI** | Google Gemini 2.0 Flash API |
| **Database** | MongoDB Atlas (Mongoose ODM) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.9
- **MongoDB** (Atlas or local instance)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/harsshks/FraudGuard-Mini-ML-AI-fraud-detection-with-JWT-auth.git
cd FraudGuard-Mini-ML-AI-fraud-detection-with-JWT-auth
```

### 2. Set up the Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, Gemini API key, and JWT secret
```

### 3. Set up the ML Service

```bash
cd ml-service
pip install -r requirements.txt
```

### 4. Set up the Client

```bash
cd client
npm install
```

### 5. Configure Environment Variables

Edit `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
ML_SERVICE_URL=http://localhost:5001
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### 6. Start all services

Open **3 terminals** and run:

```bash
# Terminal 1 — ML Service
cd ml-service
python app.py
# Runs on http://localhost:5001

# Terminal 2 — Backend Server
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 3 — Frontend Client
cd client
npm run dev
# Runs on http://localhost:5173
```

### 7. Open the app

Visit **http://localhost:5173** → Sign up → Start analyzing transactions!

---

## 📂 Project Structure

```
FraudGuard-Mini/
├── client/                     # React frontend
│   └── src/
│       ├── components/
│       │   ├── Header.jsx          # Navigation with auth-aware UI
│       │   ├── Footer.jsx          # Footer with links
│       │   ├── HomePage.jsx        # Landing page
│       │   ├── DashboardPage.jsx   # Main dashboard layout
│       │   ├── Dashboard.jsx       # Transaction list + stats
│       │   ├── TransactionForm.jsx # Submit transactions
│       │   ├── AnalyticsPanel.jsx  # Charts (Pie, Bar, Area)
│       │   ├── LoginPage.jsx       # Login form
│       │   ├── SignupPage.jsx      # Registration form
│       │   └── ProfilePage.jsx     # User profile + stats
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state
│       ├── App.jsx                 # Routes + protected routes
│       └── index.css               # Design system + animations
│
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   └── fraudCheck.js           # ML + AI pipeline
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt)
│   │   └── Transaction.js          # Transaction schema
│   ├── routes/
│   │   ├── auth.js                 # Register, login, profile
│   │   └── transactions.js         # CRUD + reports + stats
│   └── server.js                   # App entry point
│
├── ml-service/                 # Python ML service
│   ├── app.py                      # Flask API
│   ├── train_model.py              # Model training script
│   ├── model.pkl                   # Trained IsolationForest model
│   └── category_encoder.pkl        # Label encoder
│
└── .gitignore
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new account | ❌ |
| `POST` | `/api/auth/login` | Login with email & password | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update name / email | ✅ |

### Transactions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/transactions` | Submit transaction for analysis | ✅ |
| `GET` | `/api/transactions` | Get user's recent transactions | ✅ |
| `DELETE` | `/api/transactions/:id` | Delete a transaction | ✅ |
| `GET` | `/api/transactions/stats` | Aggregated analytics data | ✅ |
| `GET` | `/api/transactions/report` | Download PDF report | ✅ |

---

## 🧠 How the ML Pipeline Works

1. **Feature Engineering** — Transaction amount, hour of day, and spending category are extracted
2. **IsolationForest** — Unsupervised anomaly detection scores each transaction (−1 = anomaly, +1 = normal)
3. **Threshold Decision** — Transactions with anomaly scores above the threshold are flagged
4. **Gemini AI** — Flagged transactions are sent to Gemini 2.0 Flash for natural-language risk explanations
5. **Result** — Combined ML score + AI reasoning is stored and displayed in real time

---

## 🔐 Security Features

- **Password Hashing** — bcrypt with 12 salt rounds
- **JWT Tokens** — 7-day expiry, stored in localStorage
- **Protected Routes** — Both server-side middleware and client-side route guards
- **Per-User Data Isolation** — MongoDB queries scoped by user ID
- **Environment Variables** — All secrets stored in `.env` (never committed)

---

## 📊 Screenshots

> Run the app locally to see the full UI — premium dark theme with glass-morphism effects, interactive charts, and real-time transaction updates.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Harsh Kumar](https://github.com/harsshks)**

*IsolationForest + Gemini 2.0 Flash + React + Express + MongoDB*

</div>
