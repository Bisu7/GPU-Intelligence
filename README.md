# GPU Intelligence

A production-grade SaaS platform for monitoring and optimizing GPU infrastructure.

## Phase 1 Features
- [x] Backend foundation (FastAPI, PostgreSQL, Redis)
- [x] JWT Authentication & RBAC (Admin/User)
- [x] Live GPU Metric Collection (nvidia-smi/pynvml or Simulator)
- [x] Premium Landing Page
- [x] Real-time Dashboard with Shadcn UI
- [x] Dockerized environment

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Zustand
- **Backend**: FastAPI, SQLModel, PostgreSQL, Redis
- **DevOps**: Docker, Docker Compose

## Getting Started

### Prerequisites
- Docker & Docker Compose
- NVIDIA Drivers (Optional, for real GPU monitoring)

### Installation
1. Clone the repository.
2. Create a `.env` file based on `.env.example`.
3. Run the application:
   ```bash
   docker-compose up --build
   ```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
