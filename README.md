# FinAdvicer - Intelligent Financial Planning Platform

FinAdvicer is a comprehensive full-stack wealth management application designed for personal portfolio tracking and long-term financial projection. It integrates real-time market data with advanced Monte Carlo simulations to provide users with probabilistic forecasting of their net worth, accounting for inflation, life events, and market volatility.

## Core Capabilities

### 1. Intelligent Portfolio Tracking
*   **Live Market Data**: Real-time price aggregation for Global Stocks, ETFs, Mutual Funds, and Commodities (Gold/Silver) using the Yahoo Finance API (via Python Microservice).
*   **Asset Management**: Centralized dashboard for managing diverse assets including Real Estate, Fixed Deposits, and custom investments.
*   **Resilient Data Pipeline**: Automated fallback mechanisms ensure data availability even during API bottlenecks.

### 2. Advanced AI Projections
*   **Monte Carlo Simulations**: The platform utilizes a dedicated Python ML service to run 10,000 simulations per asset using Geometric Brownian Motion (GBM). This provides a 90% confidence interval (Best, Worst, and Expected case scenarios) for future wealth growth.
*   **Inflation-Adjusted Forecasting**: Financial goals and expenses are projected using variable inflation rates (e.g., higher inflation for Education/Healthcare vs. general lifestyle expenses).

### 3. Strategic Financial Planning
*   **Smart Insurance Analysis**: Logic to differentiate between Term Life (finite premium term) and Health Insurance (inflation-linked premiums), preventing the overestimation of long-term liabilities.
*   **Life Event Modeling**: Time-specific deduction of major expenses (e.g., Social Gatherings, Education) to ensure liquidity analysis is accurate for specific future years.
*   **Net Worth visualization**: Interactive charts (Recharts) visualizing current vs. projected net worth with dynamic risk toggles.

---

## Technical Architecture

The application follows a Service-Oriented Architecture (SOA) separating the core logic from the computation-heavy data science layer.

*   **Frontend**: React.js (Vite) for a responsive user interface.
*   **Backend**: Node.js & Express.js for RESTful API management and secure data persistence.
*   **Database**: MongoDB (Mongoose ODM) with schemas optimized for time-series financial data.
*   **ML Service**: Python (FastAPI) microservice handling:
    *   `yfinance` for historical market data.
    *   `NumPy`/`Pandas` for vectorised Monte Carlo simulations.
    *   `Scikit-learn` for predictive modeling foundation.

---

## Installation & Deployment

### Prerequisites
*   Node.js (v16+)
*   Python (v3.9+)
*   MongoDB (Local or Atlas)

### 1. Repository Setup
```bash
git clone <repository-url>
cd FinAdvicer
```

### 2. Backend (Node.js)
Navigate to the server directory, install dependencies, and start the API.
```bash
cd server
npm install
# Ensure .env contains PORT, MONGO_URI, and JWT_SECRET
npm run dev
```

### 3. ML Service (Python)
Navigate to the ML service directory and install requirements.
```bash
cd ml_service
pip install -r requirements.txt
python main.py
# Reference: See start_ml.bat for Windows automation
```

### 4. Frontend (React)
Navigate to the source directory and launch the client.
```bash
cd src
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## License
This project is licensed for personal and educational use.
