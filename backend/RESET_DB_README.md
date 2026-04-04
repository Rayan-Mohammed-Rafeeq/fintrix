# Fintrix DB Reset (Dev)

Docker engine is not available on this machine (CLI cannot connect), and `psql` is not in PATH.

This reset uses **Option A** (wipe old data): we drop and recreate the `fintrix_db` database.

## Steps (pgAdmin)
1. Open **pgAdmin** → connect to your local Postgres server.
2. Open **Query Tool** on the `postgres` database.
3. Paste and execute the contents of `db-reset.sql`.
4. Start backend:

```cmd
cd /d E:\Fintrix\backend
.\mvnw.cmd spring-boot:run
```

Because `application.properties` uses:

```properties
spring.jpa.hibernate.ddl-auto=${JPA_DDL_AUTO:create-drop}
```

Hibernate will recreate the schema on startup, now clean and consistent.

## Verify
- `GET http://localhost:8080/api/v1/workspaces` should work after login.
- `POST http://localhost:8080/api/v1/workspaces` should now return 200 with the created workspace.

