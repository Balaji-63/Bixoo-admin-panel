# BIXOO Admin Panel

A comprehensive React-based unified administration console connected to a FastAPI Python backend.

## Architecture

This project is strictly split into:
- `frontend/` (React + Vite, Tailwind CSS)
- `backend/` (FastAPI, SQLAlchemy, SQLite/MySQL)

## Starting the Application

### 1. Start the Backend
```bash
cd backend
python -m venv venv
# Activate venv: `venv\Scripts\activate` on Windows, or `source venv/bin/activate` on Linux/Mac
pip install -r requirements.txt
python seed.py # Seeds the dummy database
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend
```bash
# In the root project folder
npm install
npm run dev
```

## Testing Credentials

You can use the following seeded credentials to log in and test the RBAC capabilities:

### Super Admin
- **Email:** `ops@bixoo.com`
- **Password:** `password`
- **Role:** `SUPER_ADMIN`
- **Access:** Has complete access to all modules, including the restricted **Governance & Settings** module. Can perform powerful overrides like `Void Auction`, `Force Close Requirement`, and `Reconcile Settlements`.

### Standard Admin
- **Email:** `admin@bixoo.com`
- **Password:** `password`
- **Role:** `ADMIN`
- **Access:** Has operational access to accounts, disputes, trips, etc. Cannot access Super Admin modules (like Governance) and will be denied by the API if attempting Super Admin actions.

## Role-Based Access Control (RBAC)

The frontend uses `AuthContext` to protect routes and components via `<PermissionGate>`. 
The backend enforces security independently via `Depends(require_permission('...'))` in the API routers.
