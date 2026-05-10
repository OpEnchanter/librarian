# Librarian
*The library management app built for people.*

## Getting Started
The fastest way to get started with librarian is with Docker.

Use the `docker-compose.yml` and `config.json` provided below to get started.

> [!IMPORTANT]
> Make sure you replace the `example_password` in both the `docker-compose.yml` and the `config.json` with a secure password. A random password can be generated easily with `openssl rand -hex 32`.

`docker-compose.yml`
```yaml
services:
    librarian:
        image: (IMAGE NOT (yet) AVAILABLE)
        container_name: librarian
        restart: unless_stopped
    postgres:
        image: postgres
        container-name: librarian_postgres
        environment:
            POSTGRES_USER: librarian
            POSTGRES_PASSWORD: example_password
            POSTGRES_DB: librarian
```

`config.json`
```json
{
    database: {
        user: librarian
        password: example_password
        name: librarian
    }
}
```