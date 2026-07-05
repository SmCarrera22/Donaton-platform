# MS Campaign Service

Microservicio encargado de la administración de campañas dentro de la plataforma Donaton.

Este servicio permite crear, consultar, actualizar y eliminar campañas de donación, manteniendo una arquitectura desacoplada basada en microservicios.

---

# Descripción

El Campaign Service corresponde a uno de los microservicios principales del backend.

Su responsabilidad es gestionar la información asociada a las campañas, permitiendo registrar objetivos, fechas de término, estados y montos asociados.

Este servicio opera de manera independiente y posee su propia capa de persistencia.

---

# Responsabilidades

El microservicio permite:

- Crear campañas
- Obtener listado de campañas
- Buscar campañas por ID
- Actualizar campañas existentes
- Eliminar campañas

---

# Arquitectura

La comunicación del sistema sigue la siguiente estructura:

    Frontend
    |
    v
    API Gateway
    |
    v
    BFF
    |
    v
    Campaign Service
    |
    v
    PostgreSQL

El microservicio no realiza llamadas hacia otros servicios.

Toda comunicación externa es gestionada por el BFF.

---

# Tecnologías utilizadas

## Backend

    - Java 25
    - Spring Boot 4
    - Spring Web MVC
    - Spring Data JPA
    - Hibernate
    - PostgreSQL
    - Flyway
    - Lombok
    - Validation
    - Swagger / OpenAPI

---

# Estructura del proyecto

    ms-campaign
    │
    ├── controller
    │   └── CampaignController
    │
    ├── service
    │   └── CampaignService
    │
    ├── repository
    │   └── CampaignRepository
    │
    ├── entity
    │   ├── Campaign
    │   └── CampaignStatus
    │
    ├── dto
    │   ├── CampaignRequest
    │   └── CampaignResponse
    │
    ├── exception
    │   ├── ResourceNotFoundException
    │   └── GlobalExceptionHandler
    │
    └── resources
    └── db
    └── migration

---

# Patrones utilizados

## Repository Pattern

La comunicación con base de datos se realiza mediante Repository.

Flujo:

    Controller
    |
    v
    Service
    |
    v
    Repository
    |
    v
    Database

---

## DTO Pattern

Los datos externos no utilizan directamente las entidades.

Se utilizan objetos:

Request:

    CampaignResponse

---

## Dependency Injection

Se utiliza inyección de dependencias mediante Spring Boot:

# Java

    @RequiredArgsConstructor

## Configuración

Archivo

    src/main/resources/application.properties

    spring.application.name=campaign

    server.port=8084

    spring.datasource.url=jdbc:postgresql://localhost:5432/campaign
    spring.datasource.username=postgres
    spring.datasource.password=password

    spring.jpa.hibernate.ddl-auto=update

    spring.flyway.enabled=true

## Endpoints

Todos los endpoints internos son:

    /campaigns

Sin embargo, el acceso recomendado es mediante BFF:

    API Gateway
    |
    v
    localhost:8080/api/campaigns

    POST /api/campaigns
    GET /api/campaigns
    GET /api/campaigns/{id}
    PUT /api/campaigns/{id}
    DELETE /api/campaigns/{id}

## Manejo de errores

El servicio posee manejo global de excepciones

## Base de Datos

Cada microservicio posee una base de datos independiente

Campaign Service utiliza PostgreSQL

Tabla Principal: campaign

## Ejecucion Local

Clonar proyecto:

    git clone <repository>

Entrar al servicio:

    cd backend/ms-campaign

Ejecutar:

    ./gradlew bootRun

## Swagger

Documentación disponible:

    http://localhost:8084/swagger-ui/index.html