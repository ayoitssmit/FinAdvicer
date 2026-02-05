# Startup Guide - FinAdvicer

To run the full application, you need to start **three separate terminals**.

### 1. Start the Backend (Server)
This handles the database and API.
```bash
cd server
npm run dev
```
*Wait until you see "Server running on port 5000" and "MongoDB Connected".*

### 2. Start the AI Service (Python)
This handles the risk projections.
```bash
cd ml_service
.\start_ml.bat
```
*Wait until you see "Application startup complete".*

### 3. Start the Frontend (Website)
This launches the website in your browser.
```bash
cd src
npm run dev
```
*Open the link shown (usually http://localhost:5173).*

---

### Troubleshooting
- **Website blank?** Check the Frontend terminal for errors.
- **"Network Error"?** Ensure the Backend terminal is running.
- **"Risk Mode" spinning?** Ensure the AI Service terminal is running.
