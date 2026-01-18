# 🚀 Deployment & CI/CD Guide: Vino Veritas AI

This guide explains how to deploy the **Vino Veritas AI Dashboard** to production using **Render** and how the **GitHub Actions CI/CD** pipeline automates this process.

---

## 🏗️ 1. Production Architecture
The application uses a **Dual-Engine** architecture that requires two separate deployment types:
1.  **Backend (API + ML Engine):** Deployed as a **Render Web Service** (Python/FastAPI).
2.  **Frontend (UI):** Deployed as a **Render Static Site** (React/Vite).

---

## ☁️ 2. Deploying to Render

### A. Backend (Web Service)
1.  Log in to [Render.com](https://render.com).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  Select the **Python** environment.
5.  **Build Command:** `pip install -r requirements.txt`
6.  **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
7.  **Environment Variables:**
    *   `PYTHON_VERSION`: `3.11.0`

### B. Frontend (Static Site)
1.  Click **New +** > **Static Site**.
2.  Connect your GitHub repository.
3.  **Build Command:** `npm run build` (This runs in the `frontend` directory).
4.  **Publish Directory:** `frontend/dist`
5.  **Environment Variables:**
    *   `VITE_API_BASE_URL`: The URL of your deployed Render Web Service (e.g., `https://vino-api.onrender.com`).

---

## 🤖 3. GitHub Actions CI/CD
We have implemented a professional CI/CD pipeline in `.github/workflows/main.yml`. Here is how it helps automate the deployment:

### 🔬 **Continuous Integration (CI)**
Every time you `git push` or create a **Pull Request**, GitHub Actions automatically:
1.  **Backend CI:** 
    *   Installs Python dependencies.
    *   Runs the `pytest` suite.
    *   Lints the code with `flake8` to catch logic errors.
2.  **Frontend CI:**
    *   Installs Node.js dependencies.
    *   Checks for **Security Vulnerabilities** using `npm audit`.
    *   Verifies that the React build is successful.

### 🚀 **Continuous Deployment (CD)**
The **Deployment Job** only runs if both the Backend and Frontend CI jobs pass successfully.
1.  **Validation:** It ensures that "broken code" never reaches production.
2.  **Automation:** Once tests pass on the `main` branch, the pipeline can trigger Render via a **Deploy Webhook**.
3.  **Efficiency:** You don't have to manually click "Deploy"—the system handles it upon successful code verification.

---

## 🔑 4. Enabling Full Automation
To make the deployment fully hands-free:
1.  Go to your Render Dashboard > **Deploy Hook**.
2.  Copy the URL.
3.  Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
4.  Create a new secret named `RENDER_DEPLOY_HOOK_URL` and paste the link.

From now on, your dashboard will **test itself, build itself, and deploy itself** every time you push to GitHub! 🍷✨
