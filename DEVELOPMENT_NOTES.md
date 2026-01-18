# 📝 Development & Deployment Notes

## 🛠️ Local Development Commands

### Backend (Python/FastAPI)
- **Install Environment**: `pip install -r requirements.txt`
- **Run Server**: `uvicorn main:app --reload`
- **Run Tests**: `pytest`
- **Linting**: `flake8 . --count --select=E9,F63,F7,F82 --exclude=untitled0.py --show-source --statistics`

### Frontend (React/Vite)
- **Navigate**: `cd frontend`
- **Install Nodes**: `npm install`
- **Run Dev Dashboard**: `npm run dev`
- **Production Build Test**: `npm run build`
- **Security Audit**: `npm audit --audit-level=high`

---

## 🚀 Pre-Deployment Success Criteria
Before sending the code to the cloud (Render/GitHub), ensure:
1. [ ] **Backend Tests Pass**: All `pytest` scenarios return GREEN.
2. [ ] **Zero Logic Errors**: `flake8` returns 0 for critical error codes.
3. [ ] **Frontend Build Success**: `npm run build` generates a `/dist` folder without errors.
4. [ ] **Model Assets Present**: Verify `wine_model.joblib` and `scaler.joblib` are in the root directory.

## ☁️ Cloud Deployment logic
- The project uses **Render Blueprints** (`render.yaml`).
- **Secret Management**: Ensure `RENDER_DEPLOY_HOOK_URL` is added to GitHub Secrets if manual deployment triggers are needed.
- **Port Binding**: The backend defaults to port `10000` on Render or respects the `$PORT` environment variable.
