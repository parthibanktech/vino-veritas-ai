# 🍷 Vino Veritas AI: Production Deployment Guide

This guide provides the definitive blueprint for deploying the **Vino Veritas AI Dashboard** to a production environment using **Render**, **Docker**, and **GitHub Actions**.

---

## 🏛️ 1. Production Architecture
The application is designed with a **Dual-Engine** architecture, optimized for high-performance data processing and a seamless user experience.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | Python 3.11 / FastAPI | ML Inference, Statistical Processing, Archival Storage |
| **Frontend** | React 18 / Vite | Interactive UI, D3-powered Visualizations, Real-time Analytics |
| **Deployment** | Docker | Containerized, immutable production environment |
| **Pipeline** | GitHub Actions | Automated Testing (CI) and One-Click Delivery (CD) |

---

## 🐳 2. Unified Deployment (Recommended)
We use a **Multi-Stage Docker Architecture**. This means a single container serves both the API and the Frontend, ensuring perfect synchronization between the UI and the backend logic.

### 🚀 Step-by-Step Render Setup:
1.  **Connect GitHub:** Create a new **Web Service** on [Render](https://render.com) and link your repository.
2.  **Runtime Selection:** Choose **Docker** as the environment.
3.  **Region:** Select a region closest to your primary user base (e.g., US East).
4.  **Environment Variables:** Add the following keys:
    *   `PORT`: `8000`
    *   `VITE_API_BASE_URL`: `/` (Self-referencing for single-container architecture).
    *   `NODE_ENV`: `production`

---

## ☁️ 3. Alternative: Microservice Deployment
If you prefer to scale the frontend and backend independently, follow this manual path:

### A. The Research Engine (Backend)
*   **Service Type:** Web Service
*   **Runtime:** Python
*   **Build Command:** `pip install -r requirements.txt`
*   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### B. The Exhibition UI (Frontend)
*   **Service Type:** Static Site
*   **Build Command:** `npm run build`
*   **Publish Directory:** `frontend/dist`
*   **Environment Variable:** `VITE_API_BASE_URL` (Set to your Backend URL).

---

## 🤖 4. DevOps: The CI/CD Pipeline
Our **Vino Veritas CI/CD** pipeline (`.github/workflows/main.yml`) is the guardian of your production stability.

### 🛡️ Automated Quality Gates:
1.  **Backend Integrity:** Runs `pytest` and `flake8` to ensure your ML enology core is mathematically and logically sound.
2.  **Security Audit:** Executes `npm audit` on the frontend to protect against third-party vulnerabilities.
3.  **Build Verification:** Confirms that the production bundle compiles without errors before any deployment occurs.

### ⚡ Enabling Auto-Delivery:
1.  Copy the **Deploy Hook URL** from the Render settings page.
2.  Add it as a **GitHub Secret** named `RENDER_DEPLOY_HOOK_URL`.
3.  **Result:** Every successfull merge into `main` will automatically trigger a production update.

---

## 📝 5. Post-Deployment Checklist
- [ ] **Health Check:** Verify `https://your-app.onrender.com/health` returns `{"status": "healthy"}`.
- [ ] **Analytics Sync:** Ensure the "Dataset Audit" correctly displays all 1,599 research samples.
- [ ] **Gallery Check:** Confirm all 300 DPI archival plots are rendering sharply in the "Research Gallery".
- [ ] **Simulator Logic:** Run a test batch in the "Batch Simulator" to verify ML inference is active.

---

*“In vino veritas, in production high-availability.”* 🍷✨
