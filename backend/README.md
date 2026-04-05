# Fintrix Backend

Secure Spring Boot backend for the Fintrix Personal Finance Manager.

> Note: The backend is hosted on Render (free tier) and may take ~1–2 minutes to spin up on the first request. Once active, responses are fast.

## Stack
- Java 17
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Lombok
- Bean Validation
- SpringDoc OpenAPI

## Features
- JWT-based register/login flow
- Role-based access control for `ADMIN` and `USER`
- Personal expense CRUD scoped to the authenticated user
- Borrow/lend transaction tracking between users
- Admin monitoring endpoints for users, expenses, and transactions
- Global exception handling with structured error responses
- Swagger UI at `/swagger-ui.html`
- Optional admin bootstrap on startup via environment variables
- Local PostgreSQL dev setup with `docker-compose.yml`

## Main Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET|POST|PUT|DELETE /api/v1/expenses`
- `POST /api/v1/transactions/borrow`
- `POST /api/v1/transactions/lend`
- `GET /api/v1/transactions`
- `PUT /api/v1/transactions/{id}/pay`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/expenses`
- `GET /api/v1/admin/transactions`

## Configuration
Default application settings live in `src/main/resources/application.properties`.
Key overrides are environment-variable friendly:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`

### `application.properties` (what you must set)

The backend reads most secrets/connection values from environment variables (see `src/main/resources/application.properties`).

Minimum required to start the app locally:

| Property in `application.properties` | Env var | Example value |
|---|---|---|
| `spring.datasource.url=${DB_URL}` | `DB_URL` | `jdbc:postgresql://localhost:5432/fintrix` |
| `spring.datasource.username=${DB_USERNAME}` | `DB_USERNAME` | `postgres` |
| `spring.datasource.password=${DB_PASSWORD}` | `DB_PASSWORD` | `postgres` |
| `app.jwt.secret=${JWT_SECRET}` | `JWT_SECRET` | `dev-secret-change-me` |
| `app.jwt.expiration-ms=${JWT_EXPIRATION_MS}` | `JWT_EXPIRATION_MS` | `86400000` (1 day) |

Optional (only needed for specific features):

| Feature | Env var(s) | Notes |
|---|---|---|
| CORS | `APP_CORS_ALLOWED_ORIGINS` | Default allows `http://localhost:*` and `http://127.0.0.1:*` |
| Password reset link base | `APP_FRONTEND_BASE_URL` | Default `http://localhost:3000` (Vite is usually `5173`, so change if you want links to open correctly) |
| Admin bootstrap user | `BOOTSTRAP_ADMIN_*` | Disabled by default (not required for local run) |
| SMTP (forgot-password emails) | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP properties are commented out by default in `application.properties` |

#### Windows (cmd.exe) example

From `backend/` set the env vars (current terminal only):

```bat
set DB_URL=jdbc:postgresql://localhost:5432/fintrix
set DB_USERNAME=postgres
set DB_PASSWORD=postgres

set JWT_SECRET=dev-secret-change-me
set JWT_EXPIRATION_MS=86400000
```

Then run:

```bat
mvn spring-boot:run
```

## Local PostgreSQL with Docker
```yaml
# Uses docker-compose.yml defaults
POSTGRES_DB=fintrix
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Start PostgreSQL locally:
```bat
docker compose up -d
```

If you previously created the container with a different password, recreate it once so the credentials match:
```bat
docker compose down -v
docker compose up -d
```


## Run
```bat
mvn spring-boot:run
```

On Windows in this repo, `mvn` is a local shim that forwards to `mvnw.cmd`, so it avoids any conflicting global Python `mvn.exe` on `PATH`.

You can also run the wrapper directly:
```bat
mvnw.cmd spring-boot:run
```

## Test
```bat
mvn test
```

## Quick Try Flow
```bat
docker compose up -d
mvn spring-boot:run
```

Then open:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Notes
- Test runs use H2 in PostgreSQL compatibility mode from `src/test/resources/application.properties`.
- JWT payload includes `userId` and `role`.
- Users can only access their own expenses and only transactions they participate in.
- Admin bootstrap is disabled by default and is idempotent for an existing email.
