# ARAM Prototype

AI-Powered Resource Intelligence for Predictive Resource Allocation.

## Prototype Overview

This hackathon-ready MVP is built as a Python backend with a React + Tailwind frontend.

### Features

- Administrator login demo
- Dashboard with KPIs, alerts, navigation
- Inventory management with MySQL storage
- Analytics engine integration layer
- AI recommendation generation workflow
- Approval screen with success feedback

## Folder Structure

- `frontend/` - React app with Tailwind UI
- `backend/` - Flask API, analytics services, MySQL schema

## Setup Instructions

1. Create a MySQL database named `aram_db`.
2. Run `backend/db_schema.sql` to create the `inventory` table.
3. Install backend dependencies:
   - `pip install -r backend/requirements.txt`
4. Start Flask backend:
   - `python backend/app.py`
5. Install frontend dependencies:
   - `cd frontend && npm install`
6. Start React frontend using Vite:
   - `cd frontend && npm run dev`
   - Open `http://localhost:5173` in your browser

> Do not open `frontend/index.html` directly or use a static Live Server on port 5500. This app requires Vite so imports like `react` and `react-dom` are resolved correctly.

## Tech Stack

- Frontend: React, Tailwind CSS, Vite
- Backend: Python, Flask
- Database: MySQL
- Analytics: Pandas, Scikit-Learn

## API Contracts

- `POST /api/auth/login` — demo credentials authentication
- `GET /api/inventory` — list stored inventory records
- `POST /api/inventory` — add a new shop inventory record
- `GET /api/analytics` — generate forecast, risk, and priority summaries
- `GET /api/recommendation` — derive AI recommendation from analytics results
- `POST /api/approval` — approve or reject the recommended allocation

## Architecture Summary

- Frontend: React + Tailwind CSS using Vite.
- Backend: Flask service layer in Python with clear separation of database, analytics, and recommendation responsibilities.
- Database: MySQL inventory table stores shop stock and demand data.
- Analytics: `backend/services/analytics_service.py` uses Pandas to compute forecast demand, surplus/deficit, risk levels, and priority scores.
- Recommendation: `backend/services/recommendation_service.py` selects a critical target shop and a safe source shop with transfer recommendation.

## Component Hierarchy

- `App.jsx`
  - `Sidebar.jsx`
  - `LoginPage.jsx`
  - `DashboardPage.jsx`
  - `InventoryPage.jsx`
  - `AnalyticsPage.jsx`
  - `RecommendationPage.jsx`
  - `ApprovalPage.jsx`

## Data Flow

1. Admin logs in at `/login`.
2. Dashboard loads analytics summary from `/api/analytics`.
3. Inventory page posts records to `/api/inventory` and reads current stock.
4. Analytics page consumes the analytics service output via `/api/analytics`.
5. Recommendation page requests a redistribution plan from `/api/recommendation`.
6. Approval page posts the admin decision to `/api/approval`.

## Prototype Flow

`/login` → `/dashboard` → `/inventory` → `/analytics` → `/recommendations` → `/approval`
