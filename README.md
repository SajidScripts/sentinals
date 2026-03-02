<div align="center">

# 🛡️ Sentinals

### Intelligent Monitoring & AI-Powered SaaS Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-teal?logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Proactive monitoring that thinks ahead of your systems.**

[Live Demo](https://sentinals.app) · [API Docs](http://localhost:3001/docs) · [Report Bug](https://github.com/sentinals/sentinals/issues)

</div>

---

## 📋 Overview

Sentinals is an enterprise-grade SaaS platform for intelligent infrastructure monitoring. It uses AI-powered anomaly detection to identify potential issues before they become incidents, providing real-time alerts, deep analytics, and proactive insights.

**Built with production-grade architecture** — clean separation of concerns, role-based access control, JWT authentication with token rotation, structured logging, rate limiting, and comprehensive API documentation.

---

## 🏗️ Architecture

```
sentinals/
├── apps/
│   ├── api/                  # NestJS Backend (REST API)
│   │   ├── prisma/           # Database schema & migrations
│   │   └── src/
│   │       ├── common/       # Filters, interceptors, middleware
│   │       ├── database/     # Prisma & Redis services
│   │       └── modules/      # Feature modules
│   │           ├── auth/     # JWT auth, RBAC, token rotation
│   │           ├── user/     # User CRUD with Redis caching
│   │           ├── project/  # Project management
│   │           ├── log/      # Structured log ingestion
│   │           ├── admin/    # Admin panel (ADMIN-only)
│   │           ├── subscription/ # Stripe-ready billing
│   │           └── health/   # Health checks
│   └── web/                  # Next.js 14 Frontend
│       └── src/
│           ├── app/          # App Router pages
│           │   ├── (auth)/   # Login & Signup
│           │   └── (dashboard)/ # Protected dashboard
│           ├── stores/       # Zustand state management
│           └── lib/          # API client, utilities
├── packages/
│   └── shared/               # Shared TypeScript types
├── docker-compose.yml        # Full-stack orchestration
└── .github/workflows/        # CI/CD pipeline
```

### Design Decisions

| Decision | Rationale |
|---|---|
| **NestJS (not Express)** | Module-based DI, decorators, built-in validation, Swagger generation. Scales to microservices. |
| **Prisma (not TypeORM)** | Type-safe queries, migration system, schema-first. Catches DB errors at compile time. |
| **Zustand (not Redux)** | Minimal API surface, no boilerplate, works outside React tree (API interceptors). |
| **Pino (not Winston)** | 5-10x faster, structured JSON, native NestJS integration. |
| **JWT + Refresh Rotation** | Stateless auth with replay detection. Compromised tokens detected via family tracking. |
| **Redis Cache-Aside** | Short TTL caching (5min user, 30s stats). Graceful degradation if Redis is down. |

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, Zustand, React Query, Framer Motion |
| **Backend** | NestJS 10, TypeScript, Prisma ORM, PostgreSQL 16, Redis 7 |
| **Auth** | JWT (access + refresh), bcrypt, Passport, RBAC (ADMIN/USER) |
| **Security** | Helmet, CORS, Rate Limiting (Throttler), Request Validation (class-validator) |
| **Logging** | Pino (structured JSON, JWT redaction, correlation IDs) |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD |
| **API Docs** | Swagger/OpenAPI (auto-generated at `/docs`) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (recommended)
- PostgreSQL 16 (if not using Docker)

### Option 1: Docker (Recommended)

```bash
# Clone and start everything
git clone https://github.com/sentinals/sentinals.git
cd sentinals
cp .env.example .env
docker-compose up --build -d

# Run database migrations
docker exec sentinals-api npx prisma migrate deploy

# Access the app
# Frontend: http://localhost:3000
# API:      http://localhost:3001/api
# Swagger:  http://localhost:3001/docs
```

### Option 2: Local Development

```bash
# Install dependencies
npm install
cd apps/api && npm install
cd ../web && npm install

# Setup database
cd apps/api
cp ../../.env.example .env
npx prisma generate
npx prisma migrate dev --name init

# Start development servers (from root)
cd ../..
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login | ❌ |
| `POST` | `/api/v1/auth/refresh` | Refresh tokens | ❌ |
| `POST` | `/api/v1/auth/logout` | Logout | ✅ |
| `GET` | `/api/v1/users/me` | Get profile | ✅ |
| `PATCH` | `/api/v1/users/me` | Update profile | ✅ |
| `GET` | `/api/v1/projects` | List projects | ✅ |
| `POST` | `/api/v1/projects` | Create project | ✅ |
| `GET` | `/api/v1/projects/:id` | Get project | ✅ |
| `PATCH` | `/api/v1/projects/:id` | Update project | ✅ |
| `DELETE` | `/api/v1/projects/:id` | Delete project | ✅ |
| `POST` | `/api/v1/projects/:id/logs` | Create log | ✅ |
| `GET` | `/api/v1/projects/:id/logs` | Query logs | ✅ |
| `GET` | `/api/v1/projects/:id/logs/stats` | Log stats | ✅ |
| `GET` | `/api/v1/subscriptions` | Get subscription | ✅ |
| `GET` | `/api/v1/subscriptions/plans` | List plans | ✅ |
| `GET` | `/api/v1/admin/stats` | Platform stats | 🔒 ADMIN |
| `GET` | `/api/v1/admin/users` | List users | 🔒 ADMIN |
| `GET` | `/api/v1/health` | Health check | ❌ |

Full interactive docs available at `http://localhost:3001/docs`

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users     │────>│   Projects   │────>│     Logs     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (UUID)    │     │ id (UUID)    │     │ id (UUID)    │
│ name         │     │ userId (FK)  │     │ projectId(FK)│
│ email (UNQ)  │     │ name         │     │ message      │
│ password     │     │ status       │     │ severity     │
│ role (ENUM)  │     │ config (JSON)│     │ metadata     │
│ subscription │     │ timestamps   │     │ timestamp    │
│ timestamps   │     └──────────────┘     └──────────────┘
└──────────────┘
        │
        v
┌──────────────┐
│RefreshTokens │
├──────────────┤
│ token (UNQ)  │
│ family       │  ← Replay attack detection
│ revoked      │
│ expiresAt    │
└──────────────┘
```

---

## 🚢 Deployment

### Vercel (Frontend) + Railway (Backend)

1. **Frontend (Vercel)**:
   ```bash
   cd apps/web
   vercel --prod
   ```
   Set `NEXT_PUBLIC_API_URL` in Vercel environment variables.

2. **Backend (Railway)**:
   - Connect your GitHub repo
   - Set root directory to `apps/api`
   - Add PostgreSQL and Redis plugins
   - Set environment variables from `.env.example`

### AWS (EC2 / ECS)
```bash
# Build and push Docker images
docker build -t sentinals-api apps/api
docker build -t sentinals-web apps/web

# Deploy with docker-compose on EC2
scp docker-compose.yml ec2-user@your-server:~/
ssh ec2-user@your-server "docker-compose up -d"
```

---

## 🔮 Future Scalability

- **Microservices**: Each NestJS module can be extracted into its own service
- **Event-Driven**: Add NATS/RabbitMQ for async log processing
- **Real-Time**: WebSocket gateway for live dashboard updates
- **Multi-Tenancy**: Organization model already designed in auth schema
- **SSO/SAML**: Enterprise auth via Passport strategies
- **Horizontal Scaling**: Stateless JWT auth, Redis-backed sessions

---

## 📄 License

MIT © [Sentinals](https://sentinals.app)
