# Donaton Project

Sistema distribuido orientado a la gestión de donaciones, desarrollado mediante una arquitectura basada en microservicios.

El proyecto busca facilitar la administración de usuarios, autenticación, campañas y donaciones mediante una solución escalable, desacoplada y contenerizada.

---

# Arquitectura General

La solución está compuesta por:

- Aplicación Frontend
- API Gateway
- Backend For Frontend (BFF)
- Microservicios independientes
- Bases de datos independientes


Arquitectura:

                               Frontend
                                  |
                                  |
                                  v
                             API Gateway
                                  |
                                  |
                                  v
                                 BFF
                                  |
        +----------------+------------------+-------------------+
        |                |                  |                   |
        v                v                  v                   v
    Auth Service    User Service    Donation Service    Campaign Service
                         |                  |                   |
                         v                  v                   v
                         DB                 DB                  DB

Cada microservicio posee su propia base de datos, con excepción de Auth Service, dado que únicamente se encarga de realizar la validación del usuario y generación de Token

---

# Principios Arquitectónicos

El proyecto sigue una arquitectura:

- Microservicios
- Bajo acoplamiento
- Alta cohesión
- Comunicación mediante API REST
- Separación de responsabilidades

Regla principal:

    Frontend
    |
    v
    API Gateway
    |
    v
    BFF
    |
    v
    Microservicios

El frontend nunca accede directamente a un microservicio.

---

# Tecnologías utilizadas

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Java 25
- Spring Boot 4
- Spring MVC
- Spring Data JPA
- Hibernate

## Comunicación

- REST API
- Spring RestTemplate

## Seguridad

- JWT
- Spring Security

## Base de datos

- PostgreSQL

## Migraciones

- Flyway

## Documentación

- Swagger OpenAPI

## Contenedores

- Docker
- Docker Compose

## Orquestación

- Kubernetes

## CI/CD

- GitHub Actions

---

# Backend

Ubicación:

    backend/

Contiene todos los servicios backend.

---

# API Gateway

Ubicación:

    backend/api-gateway

Responsabilidad:

- Punto único de entrada del sistema
- Manejo de rutas externas
- Comunicación con BFF

Puerto: 8090

---

# BFF (Backend For Frontend)

Ubicación:

    backend/bff

Responsabilidad:

- Orquestación de microservicios
- Adaptación de respuestas
- Comunicación entre servicios
- Manejo de endpoints externos

Puerto: 8080

---

# Microservicios

## Auth Service

Ubicación:

    backend/ms-auth

Responsabilidades:

- Login
- Generación JWT
- Validación JWT

Puerto: 8082

---

## User Service

Ubicación:

    backend/ms-user

Responsabilidades:

- Registro usuarios
- CRUD usuarios
- Información de autenticación

Puerto: 8081

---

## Donation Service

Ubicación:

    backend/ms-donation

Responsabilidades:

- Gestión de donaciones
- Registro
- Consulta
- Actualización
- Eliminación

Puerto: 8083

---

## Campaign Service

Ubicación:

    backend/ms-campaign

Responsabilidades:

- Administración de campañas
- Objetivos
- Estados
- Información pública

Puerto: 8084

---

# Persistencia

Cada microservicio mantiene una base de datos independiente.

        Auth Service    User Service    Donation Service    Campaign Service
                         |                  |                   |
                         v                  v                   v
                         DB                 DB                  DB

---

# Patrones utilizados

## Repository Pattern

    controller
        |
    service
        |
    repository
        |
    database

---

## DTO Pattern

Cada servicio separa:

Request:
    DTO entrada

Response:
    DTO salida

Las entidades no son expuestas directamente.

---

## Dependency Injection

Uso de Spring:

    @RequiredArgsConstructor

# Manejo de Errores

Todos los servicios poseen manejo global:

    @RestControllerAdvice

# Ejecución Local

## Requisitos

Instalar:

* Java 25
* Gradle
* PostgreSQL

⸻

# Backend

Ingresar a cada servicio:

    cd backend/ms-xxxxx

Ejecutar:

    ./gradlew bootRun

# Pruebas

Las APIs pueden probarse mediante:

* Postman
* Swagger UI

# Seguridad

Flujo de autenticación:

        Usuario
           |
          BFF
           | 
       User Service
           |
       Auth Service
           |
          JWT

El token generado es utilizado para validar acceso a recursos protegidos.

# Docker

Cada pieza de software posee:

    Dockerfile

El despliegue completo será realizado mediante:

    docker-compose.yml

Incluyendo:

* Frontend
* Gateway
* BFF
* Servicios backend
* PostgreSQL

# Kubernetes

La solución contempla despliegue mediante:

    kubernetes

Archivos esperados

    deployment.yaml

Para:

* Frontend
* Gateway
* BFF
* Microservicios

----

# CI/CD

La automatización utiliza:

    Github Actions

Pipeline:

         Push
          |
        Build
          |
         Test
          |
        Deploy

# Estrategia Git

Se utiliza Git Flow simplificado:

         main
           |
        develop
           |
        feature/*

