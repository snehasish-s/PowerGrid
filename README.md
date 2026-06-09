# ⚡ PowerPulse AI — Smart Utility Asset Intelligence Platform

> **TPCODL (Tata Power Central Odisha Distribution Limited)**
> AI-powered asset health monitoring, fault prediction, and maintenance optimization for electrical utility infrastructure.

---

## 🏗️ Architecture

| Service | Technology | Port |
|---|---|---|
| **Backend** | Spring Boot 3 + Spring Security (JWT) + JPA | `8080` |
| **Frontend** | React + Tailwind CSS + Chart.js + Leaflet | `3000` |
| **ML Service** | Python + FastAPI + XGBoost + Pandas | `8000` |
| **Database** | MySQL 8.0 | `3306` |

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 4.x+
- Docker Compose v2+

### One-Command Launch
```bash
# Clone and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **ML Service**: http://localhost:8000/docs
- **MySQL**: localhost:3306

### Default Login Credentials
| Role | Username | Password |
|---|---|---|
| Admin | `admin@tpcodl.com` | `Admin@2026!` |
| Field Engineer | `engineer@tpcodl.com` | `Engineer@2026!` |
| Maintenance Manager | `manager@tpcodl.com` | `Manager@2026!` |
| Executive | `executive@tpcodl.com` | `Executive@2026!` |

## 🛠️ Development Setup

### Backend (without Docker)
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (without Docker)
```bash
cd frontend
npm install
npm run dev
```

### ML Service (without Docker)
```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 📊 Core Features

- **Asset Management** — Track transformers, feeders, poles, meters across TPCODL zones
- **Fault Tracking** — Real-time fault logging with severity classification
- **Predictive Maintenance** — XGBoost-powered failure probability prediction
- **Interactive Maps** — Leaflet/OpenStreetMap with live asset overlay
- **Role-Based Access** — Admin, Field Engineer, Maintenance Manager, Executive
- **Inventory Management** — Spare parts tracking with reorder alerts
- **Outage Monitoring** — Real-time outage tracking and customer impact analysis

## 📁 Project Structure

```
TPCODL_Project/
├── backend/           # Spring Boot 3 API server
├── frontend/          # React + Tailwind dashboard
├── ml-service/        # Python FastAPI ML predictions
├── docker-compose.yml # One-command deployment
├── .env               # Environment configuration
└── design.md          # Tata Power Dark Grid design system
```

---

*Built for TPCODL Internship 2026 | PowerPulse AI v1.0*
