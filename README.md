
<p align="center">
  <img src="https://github.com/Rayan-Mohammed-Rafeeq/fintrix/blob/main/frontend/public/icon.png" alt="Fintrix Logo" width="140"/>
</p>

<h1 align="center">Fintrix</h1>

Full-stack finance management platform for tracking expenses and transactions in **workspace-based** accounts with **role-based access control (RBAC)**.

**Backend:** Spring Boot (JWT secured REST API) · **Frontend:** React (Vite) · **DB:** PostgreSQL (Neon)

> Monorepo: see [`backend/`](./backend) and [`frontend/`](./frontend).

---

## Project Overview

Fintrix helps individuals or small teams manage finances in a structured way:

- **Workspaces** isolate data per group/team (multi-tenant-by-design).
- **Roles** (Admin / Analyst / Viewer) enforce who can manage members vs analyze vs view.
- **Expenses & transactions** are captured as workspace-scoped records.
- **Dashboards** provide totals and summaries to quickly understand spending trends.

The system is designed around a clean separation of concerns (controller → service → repository) and workspace-scoped authorization.

---

## Features

- **Role-Based Access Control (RBAC)**: Admin, Analyst, Viewer
- **Workspace-based multi-tenant architecture** (data isolated per workspace)
- **Expense tracking** (CRUD) and **transaction management**
- **Borrow/Lend flows** with validation (members must belong to the same workspace)
- **Dashboard analytics** (totals, summaries, trends; aggregated server-side)
- **Secure authentication** with **JWT**
- **Forgot password / reset password** flow

---

## System Architecture

Deployment flow:

```
React (Vercel)  -->  Spring Boot API (Render)  -->  PostgreSQL (Neon)
```

Logical layering (backend):

- **Controller layer**: REST endpoints, request validation, response shaping
- **Service layer**: business rules (RBAC checks orchestration, workspace validation, borrow/lend logic)
- **Repository layer**: persistence via Spring Data JPA
- **Security layer**: JWT auth, CORS configuration, role/workspace authorization

API documentation is available via Swagger/OpenAPI when running locally:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## Tech Stack

### Backend

- Java 17
- Spring Boot (Spring Web, Spring Security, Spring Data JPA)
- JWT authentication (JJWT)
- OpenAPI / Swagger UI (springdoc)

### Frontend

- React + TypeScript
- Vite
- Axios + TanStack Query (server-state)

### Database

- PostgreSQL (local via Docker Compose, production on Neon)

### Deployment

- Backend: Render
- Frontend: Vercel
- Database: Neon (managed Postgres)

---

## Project Structure

```
fintrix/
  backend/        # Spring Boot REST API
  frontend/       # React (Vite) client
```

### Backend internals (high level)

Typical package responsibilities (verify exact names in `backend/src/main/java`):

- `controller/` – HTTP endpoints (auth, workspaces, members, expenses, transactions, summary)
- `service/` – business rules and orchestration
- `repository/` – Spring Data JPA repositories
- `entity/` – JPA entities (User, Workspace, Membership, Expense, Transaction, ...)
- `dto/` – request/response DTOs
- `security/` – JWT filters, security configuration, authorization helpers
- `config/` – app configuration and bootstrapping
- `enums/` – role types, domain enums

### Frontend internals (high level)

- `src/api/` – API client modules (Axios)
- `src/pages/` – route pages
- `src/components/` – reusable UI components
- `src/store/` / `src/contexts/` – auth + shared state
- `src/hooks/` – data and UI hooks

---

## How It Works (End-to-End)

### 1) Authentication (registration / login)

1. User registers or logs in via `/api/v1/auth/*`.
2. Backend returns a **JWT**.
3. Frontend stores the token and sends it on subsequent requests (typically via `Authorization: Bearer <token>`).

### 2) Role-based access control enforcement

- Routes are protected by Spring Security.
- RBAC rules are enforced on endpoints (and/or at service level).
- Workspace-scoped endpoints additionally verify the caller is a member of that workspace and has sufficient permissions.

### 3) Workspace creation and membership

- A user can create a **workspace**.
- Admins can manage members (add/remove/update role).
- Membership is the foundation for **tenant isolation**: all core finance data is workspace-scoped.

### 4) Expense & transaction lifecycle

- **Expenses** and **transactions** are created, updated, and queried within a workspace context.
- The backend validates ownership and membership to prevent cross-workspace access.

### 5) Borrow/Lend validation logic

- Borrow/Lend operations ensure that:
  - The involved users are **members of the same workspace**.
  - The transaction transitions (e.g., paying/settling) are valid.

### 6) Dashboard aggregation logic

- Dashboard endpoints compute aggregates server-side (totals, summaries, and time-based rollups).
- This keeps the frontend thin and avoids shipping large raw datasets for basic analytics.

---

## API Overview

The API is organized under `/api/v1` and grouped by feature area:

- **Auth**: register, login, forgot password, reset password
- **Workspaces**: create/list workspaces
- **Workspace Members**: invite/list/update role/remove members
- **Workspace Expenses**: CRUD expenses within a workspace
- **Workspace Transactions**: borrow/lend/list/pay lifecycle
- **Summary / Dashboard**: totals and aggregated analytics per workspace

For the full, up-to-date contract, use Swagger UI locally (`/swagger-ui.html`).

---

## Setup Instructions (Local Development)

### Prerequisites

- Node.js (LTS recommended)
- pnpm
- Java 17
- Docker (for local Postgres)

### 1) Start PostgreSQL locally (Docker)

From `backend/`:

```cmd
cd E:\fintrix\backend
docker compose up -d
```

### 2) Configure environment variables

#### Backend (`backend/src/main/resources/application.properties` uses env vars)

Set the following variables in your shell, IDE run configuration, or a `.env` file (if enabled in this project):

- `DB_URL` (e.g. `jdbc:postgresql://localhost:5432/fintrix`)
- `DB_USERNAME` (e.g. `postgres`)
- `DB_PASSWORD` (e.g. `postgres`)
- `JWT_SECRET` (a long random secret)
- `JWT_EXPIRATION_MS` (e.g. `86400000` for 24h)

Common optional variables:

- `APP_CORS_ALLOWED_ORIGINS` (for local dev / deployed frontends)
- `APP_FRONTEND_BASE_URL` (used for password reset links)
- `JPA_DDL_AUTO` (e.g. `update`, `validate`)
- `JPA_SHOW_SQL` (`true/false`)

#### Frontend

Create `frontend/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

### 3) Run the backend

```cmd
cd E:\fintrix\backend
mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 4) Run the frontend

```cmd
cd E:\fintrix\frontend
pnpm install
pnpm dev
```

Frontend runs on: `http://localhost:3000`

---

## Deployment

### Backend (Render)

- Build and deploy the Spring Boot service.
- Configure Render environment variables (DB + JWT + CORS + frontend URL).
- Ensure the service can reach Neon Postgres.

### Frontend (Vercel)

- Deploy the Vite build.
- Set `VITE_API_BASE_URL` to the Render backend URL.

### Database (Neon)

- Create a Neon Postgres database.
- Use the Neon connection string values for `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.

---

## Demo Credentials

> Replace these placeholders with real demo accounts (or remove before open-sourcing).

- **Admin**: `admin@example.com` / `AdminPassword123!`
- **Analyst**: `analyst@example.com` / `AnalystPassword123!`
- **Viewer**: `viewer@example.com` / `ViewerPassword123!`

---

## Screenshots / Demo

Add screenshots or a short demo video/GIF here:

- Dashboard (placeholder)
- Workspace members & roles (placeholder)
- Expenses & transactions (placeholder)

---

## Key Highlights

- **Workspace isolation**: prevents cross-tenant access by design
- **Secure RBAC**: role checks + workspace membership validation
- **Clean architecture**: controllers keep HTTP concerns separate from business logic and persistence

---

## Future Improvements

- Notifications (email + in-app)
- Mobile application
- Advanced analytics (budgeting, forecasting, anomaly detection)
- Audit logs for admin actions
- Improved reporting exports (CSV/PDF)

---

## Additional Documentation

- Backend docs: [`backend/README.md`](./backend/README.md)
- Frontend docs: [`frontend/README.md`](./frontend/README.md)
- Database reset notes: [`backend/RESET_DB_README.md`](./backend/RESET_DB_README.md)


