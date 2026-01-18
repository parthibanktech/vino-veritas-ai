An enterprise AI solution to analyze and predict wine quality based on physicochemical properties.

---

### 👨‍🏫 Project Overview
**Lead Developer:** Parthiban  
**Purpose:** This project was created exclusively for **Educational and Enological Research** purposes. It serves as a comprehensive demonstration of integrating Machine Learning with modern Full-Stack Web Architecture and DevOps automation.

---

## 🚀 Quick Start

### Backend
1. Install dependencies: `pip install -r requirements.txt`
2. Run API: `uvicorn main:app --reload`
3. Swagger Docs: `http://localhost:8000/docs`
### Detailed Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)

### Frontend
1. Navigate to frontend: `cd frontend`
2. Install: `npm install`
3. Run dev: `npm run dev`

## 🧪 Local Quality Checks (Pre-Deployment)
Before pushing to production/cloud, run these checks to ensure everything is "Green Light":

### 1. Full Backend Check
Run tests and check for syntax/logic errors:
```bash
pip install pytest flake8
pytest tests/
flake8 . --count --select=E9,F63,F7,F82 --exclude=untitled0.py --show-source --statistics
```

### 2. Full Frontend Check
Verify the production build compiles correctly and check for security issues:
```bash
cd frontend
npm install
npm run build
npm audit --audit-level=high
```

## 📂 Project Structure
- `main.py`: FastAPI backend.
- `wine_model.joblib`: Trained RandomForest model.
- `scaler.joblib`: Feature scaler.
- `frontend/`: React + Vite + Tailwind application.
- `tests/`: Pytest suite.
- `.github/workflows/`: CI/CD pipelines.
- `untitled0.py`: (Scratchpad) Original data analysis/training notebook logic.
