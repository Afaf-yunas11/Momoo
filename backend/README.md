# mOOMOO Backend

Spring Boot starter for the mOOMOO dairy management platform.

## Stack

- Java 21
- Spring Boot 3
- PostgreSQL
- Flyway
- Spring Data JPA
- Spring Security
- SpringDoc OpenAPI

## Modules scaffolded

- `auth`
- `animal`
- `milk`
- `feed`
- `health`
- `reproduction`
- `finance`
- `environment`
- `reports`
- `admin`

## What is included

- Base Spring Boot project structure
- Initial entities and repositories
- Starter controllers and services for major API routes
- PostgreSQL schema migration at `src/main/resources/db/migration/V1__init_schema.sql`
- Swagger UI path configured at `/swagger-ui`

## Before running

1. Install Java 21 and Maven 3.9+ on this machine.
2. Create a PostgreSQL database named `moomoo`.
3. Set environment variables if needed:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/moomoo"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
$env:AI_SERVICE_URL="http://localhost:8000"
```

4. Run:

```powershell
docker compose up -d
```

If you want to run the backend outside Docker instead:

```powershell
cd backend
mvn spring-boot:run
```

## Important note

This is an initial scaffold. Security is intentionally permissive for now so route and data modeling can move quickly while we build the real JWT/RBAC layer next.
