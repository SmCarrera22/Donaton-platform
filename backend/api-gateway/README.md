# API Gateway - Donaton

## Descripción

Este módulo corresponde al **API Gateway** de la arquitectura de microservicios del sistema Donaton.

Su responsabilidad principal es actuar como punto de entrada único para todas las solicitudes del frontend, redirigiendo el tráfico hacia el BFF (Backend For Frontend).

---

## Arquitectura

Frontend → API Gateway → BFF → Microservicios

El gateway no contiene lógica de negocio.

---

## Tecnologías

- Java 25
- Spring Boot
- Spring Cloud Gateway
- Maven/Gradle
- Docker
- Kubernetes

---

## Responsabilidades

- Enrutamiento de solicitudes HTTP
- Centralización del acceso al backend
- Preparación para futuras políticas de seguridad (JWT, filtros)
- Exposición de endpoints del BFF

---

## Rutas principales

| Path | Destino |
|------|--------|
| /api/** | BFF Service |

---

## Ejecución local

    ./gradlew bootRun

# Docker

    docker build -t api-gateway .
    docker run -p 8080:8080 api-gateway
