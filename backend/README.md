# Fintrix Backend

Secure Spring Boot backend for the Fintrix Personal Finance Manager.

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
- `BOOTSTRAP_ADMIN_ENABLED`
- `BOOTSTRAP_ADMIN_NAME`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`

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

## Optional Admin Bootstrap
Set these before startup if you want an admin user created once when the email does not already exist:

```bat
set BOOTSTRAP_ADMIN_ENABLED=true
set BOOTSTRAP_ADMIN_NAME=Fintrix Admin
set BOOTSTRAP_ADMIN_EMAIL=admin@fintrix.local
set BOOTSTRAP_ADMIN_PASSWORD=ChangeMe123!
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
