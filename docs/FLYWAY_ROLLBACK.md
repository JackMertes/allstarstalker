# Flyway migrations and rollback

Schema is managed by **Flyway** in the backend: migrations in `backend/src/main/resources/db/migration/` run automatically on application startup. This is the usual approach in production Java/Spring apps.

## Do we have “code” for the tables?

- **SQL (schema):** Yes. The tables are defined in the **Flyway migration scripts** (V1–V4). That *is* the definition of the database schema; it lives in the repo and is applied when the app starts.
- **Java entities (JPA):** Yes. The backend has `@Entity` classes (`Team`, `Flight`, `Airport`, `TeamFlight`, etc.) in `backend/src/main/java/…/entities/` that map to these tables via Spring Data JPA.

The migrations are the source of truth for schema; the JPA entities reflect that schema in Java.

## What code runs the migrations, and when?

- **Who:** Spring Boot’s **Flyway auto-configuration**. When the app starts, Spring sees Flyway on the classpath and a configured `DataSource`, and runs Flyway **before** the rest of the app (e.g. controllers) start.
- **What Flyway does:** It connects to the same database as the app (using `spring.datasource.*`), looks at the `flyway_schema_history` table (creates it if the DB is new), compares it to the migration files in `db/migration/`, and runs any **new** scripts in order (V1, then V2, then V3, then V4, then any future V5, V6, …). Each migration runs only once; Flyway records the version in `flyway_schema_history`.
- **No extra “run” step:** You don’t run a script by hand. Starting the backend (e.g. `java -jar app.jar` or Docker) is enough; Flyway runs as part of startup.

## Do they persist?

- **Yes.** Migrations run against the **MySQL** database. The schema and data live in MySQL.
- **Where MySQL stores data:** In Docker, the MySQL container uses a **named volume** (`mysql_data` in `docker-compose.yml`). That volume is on disk; it survives container restarts and `docker compose down` (only `docker compose down -v` removes it). So:
  - Tables and data persist in MySQL.
  - MySQL’s data directory is on `mysql_data` → **persists** across restarts.
  - Flyway’s “what already ran” is in the table `flyway_schema_history` in that same DB → also persists.

So: **migrations run once per version; the result (tables + data) is stored in MySQL and persists** as long as you don’t delete the volume.

## Summary: how it works

- **V1__baseline_tables.sql** – creates tables
- **V2__views.sql** – creates views
- **V3__stored_procedures.sql** – creates stored procedures
- **V4__seed_data.sql** – inserts initial data

On every backend startup, Flyway runs only migrations that are not yet in `flyway_schema_history`. After that, the app runs as usual. The database (and its data) persists via MySQL and the `mysql_data` volume.

## Rollback strategy

Flyway does **not** run “down” migrations by default. Standard approach:

1. **Before any schema change:** Back up the database (e.g. `mysqldump` or your cloud backup).
2. **If a migration is wrong:** Fix forward with a **new** migration (e.g. `V5__fix_foo.sql`) that corrects the schema or data. Do not edit already-applied migrations.
3. **If you must undo:** Restore from the backup taken in step 1. Then fix the migration (or add a corrective migration) and redeploy.

## Testing on a clean DB

To test migrations from scratch (e.g. locally):

1. Remove the MySQL data volume so the DB is empty, e.g.  
   `docker compose down -v`  
   then start again with your compose command.
2. Ensure the MySQL service creates the database (e.g. `MYSQL_DATABASE=nba_flight_tracker` in your env).
3. Start the backend; Flyway will run V1–V4 and create schema + seed data.
