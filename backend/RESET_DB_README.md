# Fintrix DB Reset (Dev)

This file is **only needed** if your local database schema/data is out of sync (for example, you ran an older version of the backend locally and then pulled newer code).

## What changed

The backend now uses **Flyway migrations** (`src/main/resources/db/migration`).

- On startup, Flyway automatically creates/updates the schema.
- Hibernate is configured to `validate` the schema (instead of auto-updating tables).

Recruiters running the project for the first time typically **do not need** any DB reset steps.

## Easiest reset (Docker)

If you're using the provided `docker-compose.yml`, wiping the Postgres volume is the simplest way to get a clean DB:

```bat
cd /d E:\fintrix\backend
docker compose down -v
docker compose up -d
```

Then start the backend (Flyway will recreate the schema):

```bat
cd /d E:\fintrix\backend
.\mvnw.cmd spring-boot:run
```

## Verify
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- After login, `GET http://localhost:8080/api/v1/workspaces` should work.

