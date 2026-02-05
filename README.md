# FinAdvicer - Personal Finance Dashboard

FinAdvicer is a comprehensive full-stack web application designed for personal portfolio management. It facilitates the tracking of diverse financial assets, including realtime stock market data, mutual funds, real estate, and commodities, while also providing tools for long-term financial planning and liability management.

## Key Features

### Live Market Tracking
*   **Equities**: Real-time price tracking for global stocks via the Finnhub API.
*   **Mutual Funds**:
    *   **Dual Mode Functionality**: Supports both direct Live Tracking (via Ticker Symbols) and SIP Calculation (Systematic Investment Plan) for projection analysis.
    *   **Resilient Data Pipeline**: Implements an automated fallback mechanism to simulated data models in events of API rate limiting or access restrictions, ensuring service continuity.
*   **Commodities**: Real-time tracking for Gold and Silver markets (USD/oz).

### Asset Management
*   **Real Estate**: Property value tracking with automated compound annual growth rate (CAGR) calculations.
*   **Fixed Income**: Management of Fixed Deposits with maturity value computation based on interest rates and tenure.

### Financial Planning
*   **Goal Tracking**: Dedicated modules for major life events such as Marriage, Education, and Retirement planning.
*   **Liability Management**: Tracking of active loans and insurance premium schedules.
*   **Net Worth Analysis**: Real-time aggregation of total assets against liabilities to provide a current Net Worth snapshot.

---

## Technical Architecture

*   **Frontend**: React.js (Vite) utilizing Recharts for data visualization and CSS Modules for scoped styling.
*   **Backend**: Node.js and Express.js REST API.
*   **Database**: MongoDB with Mongoose ODM.
    *   **Architecture**: Micro-collection design pattern (distinct collections for Stocks, MutualFunds, Properties, etc.) to enhance query performance and schema scalability.
*   **Authentication**: JSON Web Token (JWT) implementation for secure session management.
*   **External Integration**: Finnhub.io API for financial market data.

---

## Installation and Setup

### Prerequisites
*   Node.js (v14+)
*   MongoDB (Local instance or Atlas URI)
*   Finnhub API Key

### Deployment Steps

1.  **Repository Setup**
    ```bash
    git clone <repository-url>
    cd FinAdvicer
    ```

2.  **Backend Configuration**
    Navigate to the server directory and install dependencies.
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/finadvicer
    JWT_SECRET=your_secure_secret_key
    FINNHUB_API_KEY=your_finnhub_api_key
    ```
    Start the backend server:
    ```bash
    npm run dev
    ```

3.  **Frontend Configuration**
    Open a new terminal window, navigate to the source directory, and install dependencies.
    ```bash
    cd src
    npm install
    ```
    Start the client application:
    ```bash
    npm run dev
    ```

4.  **Access**
    The application will be accessible at standard localhost port (default: `http://localhost:5173`).

---

## License
This software is provided for educational and personal use.

## How to Run (Full Stack)
See [STARTUP_GUIDE.md](STARTUP_GUIDE.md) for detailed instructions.

**Quick Summary:**
1.  **Backend**: `cd server` -> `npm run dev`
2.  **AI Service**: `cd ml_service` -> `.\start_ml.bat`
3.  **Frontend**: `cd src` -> `npm run dev`
