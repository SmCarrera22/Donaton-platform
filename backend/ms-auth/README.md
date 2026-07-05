# MS Auth Service
Microservicio encargado de la autenticación y autorización mediante JWT.
Forma parte de la arquitectura Donaton.

---

# Descripción
MS Auth es responsable de:

    - Autenticar usuarios.
    - Generar tokens JWT.
    - Validar tokens JWT.
    - Entregar información de autenticación al resto de componentes.

Este servicio NO posee base de datos propia.
No mantiene información persistente.

---

# Arquitectura
Flujo:

    Frontend
    ↓
    API Gateway
    ↓
    BFF
    ↓
    Auth Service

El BFF es responsable de la orquestación.
Auth Service solamente recibe la información necesaria para validar credenciales.

---

# Tecnologías
    - Java 25
    - Spring Boot
    - Spring Security
    - JWT
    - Gradle
    - Swagger/OpenAPI
    - Docker
    - Kubernetes

---

# Puertos

Servicio:
    8082

---

# Endpoints
## Login

    POST
    /auth/login
# Entrada:
# json
    {
        "email":"usuario@email.com",
        "password":"password",
        "passwordHash":"hash",
        "role":"USER"
    }

# Respuesta:
    {
        "token":"jwt-token"
    }

## Validate
    POST
    /auth/validate

# Header requerido:
    Authorization: Bearer TOKEN

# Respuesta ejemplo:
    {
        "valid":true,
        "email":"usuario@email.com",
        "role":"USER"
    }

## Seguridad
El servicio utiliza:

    * JWT
    * Spring Security
    * PasswordEncoder BCrypt

# Ejecución local
Compilar:

    ./gradlew clean build

Ejecutar:

    ./gradlew bootRun

## Docker
Construir imagen:

    docker build -f deploy/Dockerfile -t ms-auth .

Ejecutar:

    docker run -p 8082:8082 ms-auth

## Kubernetes

Aplicar deployment:
    
    kubectl apply -f deploy/k8s/deployment.yaml

Aplicar service:

    kubectl apply -f deploy/k8s/service.yaml

## Estado

Implementado:

    ✔ JWT
    ✔ Login
    ✔ Validación JWT
    ✔ Swagger
    ✔ Docker
    ✔ Kubernetes
    ✔ CI/CD