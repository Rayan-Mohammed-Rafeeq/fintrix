-- Fintrix DB reset (Option A): wipe old data and restore clean schema compatibility.
-- Run this in your SQL tool connected as a superuser (e.g., postgres) on localhost.
--
-- If you use pgAdmin:
--  1) Open Query Tool on any DB (e.g., postgres)
--  2) Paste and execute this script
--

-- Terminate active connections to the target DB (if needed)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'fintrix_db'
  AND pid <> pg_backend_pid();

-- Drop and recreate the DB
DROP DATABASE IF EXISTS fintrix_db;
CREATE DATABASE fintrix_db;

-- Notes:
-- After this, start the backend with:
--   spring.jpa.hibernate.ddl-auto=create-drop (already set as default)
-- so Hibernate will recreate all tables from entities.

