# Fintrix Frontend

React + Vite + TypeScript UI integrated with the Spring Boot backend.

> Note: The backend is hosted on Render (free tier) and may take ~1–2 minutes to spin up on the first request. Once active, responses are fast.

## Prerequisites

- Node.js 18+
- pnpm
- Backend running at `http://localhost:8080`

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development server:

```bash
pnpm dev
```

## API Integration Notes

- Base URL is configured via `VITE_API_BASE_URL`.
- Axios client is in `src/api/client.ts`.
- JWT token is persisted in `localStorage` and attached via interceptor.
- Auth, expenses, transactions, and admin APIs are in `src/api`.
- TanStack Query hooks are in `src/hooks`.
- Auth state helpers are in `src/store/authStore.ts`.

## Routes

- User routes require `USER` role and redirect to `/dashboard`.
- Admin routes require `ADMIN` role and redirect to `/admin`.
- Authenticated users hitting `/login` or `/register` are redirected by role.

