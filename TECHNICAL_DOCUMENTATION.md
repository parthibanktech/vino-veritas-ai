# 🍷 Vino Veritas AI: Technical Architecture

This document outlines the dual-engine architecture of the Vino Veritas Wine Quality Dashboard, explaining how Python and React collaborate to provide high-fidelity enological insights.

---

## 🏗️ System Overview

The application is built on a **Hybrid Research Dashboard** model:
1.  **Python Research Kernel (Compute & EDA)**: Handles heavy data processing, machine learning inference, and high-fidelity archival visualizations.
2.  **React Frontend (Interaction & Real-time)**: Provides a premium, interactive UI with live charting and real-time simulator capabilities.

---

## 🐍 Python: The Research Engine

### 1. Data Processing (`wine_analysis.py`)
Utilizes `pandas` and `scikit-learn` to:
- Load the Red Wine Quality dataset (1,599 samples).
- Perform feature scaling using `StandardScaler`.
- Train a `RandomForestRegressor` ensemble model to quantify chemical quality drivers.

### 2. Archival Visualizations (`generate_static_plots.py`)
Python's `matplotlib` and `seaborn` libraries create high-fidelity snapshots for the **Research Gallery**:
- **Distribution Plots**: Individual histograms with KDE (Kernel Density Estimation) for each chemical feature.
- **Correlation Heatmaps**: Global Pearson correlation matrices to show inter-chemical dependencies.
- **Why Python for this?** Matplotlib offers "publication-grade" control over statistical nuances (like KDE curves) that are difficult to replicate in real-time JS libraries.

### 3. Backend API (`main.py`)
Using **FastAPI**, Python exposes several endpoints:
- `/features`: Returns importance weights calculated by the Random Forest model.
- `/predict`: Accepts chemical parameters and returns a real-time quality index.
- `/analytics/*`: Provides raw distribution and correlation data for the interactive React charts.

---

## ⚛️ React: The Interactive Dashboard

### 1. Real-Time Data Visualization
The dashboard utilizes **Recharts** for live, interactive data display. Unlike the static Python plots, these are:
- **Responsive**: Scale perfectly to any screen size.
- **Interactive**: Hover effects show precise values and tooltips.
- **Dynamic**: Update instantly when new data is received from the API.

### 2. State Management
React's `useState` and `useEffect` manage the complex lifecycle of the dashboard:
- **Fetching**: Parallel requests to the FastAPI backend on mount to hydrate charts.
- **Simulation**: Controlled forms allow users to manipulate "virtual" chemical batches and see real-time quality projections.

### 3. Premium UI & UX
- **Tailwind CSS**: Used for the "Premium Ivory Light Theme" with glassmorphic cards and refined typography.
- **Lucide Icons**: Provide a consistent, scientific visual language.
- **Framer Motion / Tailwind Animate**: Ensure smooth entry transitions and hover micro-animations.

---

## 🔄 Dual-Visualization Strategy

| Feature | React (Recharts) | Python (Matplotlib/Seaborn) |
| :--- | :--- | :--- |
| **Primary Use** | Real-time interactive analytics | High-fidelity scientific archive |
| **Responsiveness** | Fluid / Automatic | Static (Snapshot-based) |
| **Statistical Depth** | Basic (Summary data) | Advanced (Full KDE / Histograms) |
| **Host Context** | Analytics Center / Scientific Lab | Research Gallery |

---

## 🛠️ Tech Stack at a Glance
- **Backend**: FastAPI, Uvicorn, Scikit-learn, Matplotlib, Seaborn.
- **Frontend**: Vite, React, Recharts, Tailwind CSS, Lucide-React.
- **Design**: Premium Ivory Theme, Fraunces (Serif) & Outfit (Sans) Typography.
