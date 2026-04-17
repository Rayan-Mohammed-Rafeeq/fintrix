<p>
  <img src="frontend/public/icon.svg" alt="Fintrix Logo" width="140"/>
</p>
<h1>Fintrix</h1>

Full‑stack finance management platform for tracking **expenses** and **transactions** in **workspace-scoped** accounts with **role-based access control (RBAC)**.

**Tech:** Spring Boot (Java 17, JWT-secured REST API) · React + TypeScript (Vite) · PostgreSQL

**Live:** https://fintrix.alliededge.app  \
**API:** https://fintrix-app-backend.onrender.com  \
**Swagger:** https://fintrix-app-backend.onrender.com/swagger-ui.html

> Backend cold start: Render free tier may take **~1–2 minutes** (sometimes **~3 minutes**) on first request after inactivity.

Monorepo: [`backend/`](./backend) (Spring Boot) · [`frontend/`](./frontend) (React)

---

## Engineering highlights

- **Multi-tenant-by-design**: all finance data is **workspace-scoped**; cross-workspace access is blocked server-side.
- **Security & authorization**: JWT authentication + **RBAC** (Admin / Analyst / Viewer) enforced on protected endpoints.
- **Clean layering**: controller → service → repository with DTOs, validation, and consistent error handling.
- **Server-side analytics**: dashboard endpoints return aggregates (totals/trends) so the client stays fast and simple.

---

## Screenshots

| Dashboard (Dark) | Dashboard (Light) |
|---|---|
| ![Dashboard (Dark)](./frontend/public/dashboard_dark.png) | ![Dashboard (Light)](./frontend/public/dashboard_light.png) |

| Workspaces | Members & Roles |
|---|---|
| ![Workspaces](./frontend/public/workspaces.png) | ![Members](./frontend/public/members.png) |

| Expenses | Transactions |
|---|---|
| ![Expenses](./frontend/public/expenses.png) | ![Transactions](./frontend/public/transactions.png) |

---

## Quick demo (2 minutes)

1. Open: https://fintrix.alliededge.app
2. Login with one of the demo accounts below
3. Open a workspace → add an expense/transaction → view the dashboard summary

### Demo credentials

| Role | Email | Password | Typical access |
|---|---|---|---|
| Admin | admin@fintrix.com | Admin123 | Full access + member management |
| Analyst | analyst@fintrix.com | Analyst123 | Create/inspect finance data |
| Viewer | viewer@fintrix.com | Viewer123 | Read-only |

> A demo workspace with pre-populated data is available.

---

## Architecture (high level)

```
React (Vercel)  -->  Spring Boot API (Render)  -->  PostgreSQL (Neon)
```

Backend responsibilities (high level):

- **Controller**: HTTP + request/response mapping
- **Service**: business rules, authorization, orchestration
- **Repository**: persistence (Spring Data JPA)
- **Security**: JWT parsing, authentication, role & workspace checks

---

## Tech stack

**Backend**

- Java 17, Spring Boot (Web, Security, Data JPA)
- JWT auth
- OpenAPI / Swagger UI

**Frontend**

- React + TypeScript (Vite)
- Axios + TanStack Query

**Database & deployment**

- PostgreSQL (local via Docker Compose, prod on Neon)
- Frontend: Vercel · Backend: Render

---

## Run locally (fast path)

For full setup details, see [`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md).

```bat
cd backend
docker-compose up -d
mvnw.cmd spring-boot:run
```

In a second terminal:

```bat
cd frontend
pnpm install
pnpm dev
```

---

## Notes / roadmap

- Add audit logs for admin actions
- Improve reporting exports (CSV/PDF)
- Extend analytics (budgets/forecasting) and performance options (caching/pagination)
