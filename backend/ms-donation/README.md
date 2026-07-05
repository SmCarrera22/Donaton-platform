# ms-donation

Microservicio encargado de la gestión de donaciones dentro del sistema Donaton.

---

## Tecnologías

- Spring Boot 4
- Java 25
- PostgreSQL
- JPA / Hibernate
- Flyway
- Lombok
- Spring Validation

---

## Responsabilidad

Este microservicio gestiona:

- Creación de donaciones
- Listado de donaciones
- Actualización de donaciones
- Eliminación de donaciones
- Persistencia independiente

---

## Arquitectura interna

Controller → Service → Repository

---

## Endpoints

- POST /donations
- GET /donations
- GET /donations/{id}
- PUT /donations/{id}
- DELETE /donations/{id}

---

## Base de datos

Cada instancia utiliza su propia base de datos PostgreSQL.

---

## Testing

- JUnit 5
- Mockito
- Cobertura mínima 80%

---

## Ejecución

# bash
    ./gradlew bootRun

# Docker
    docker build -t ms-donation .
