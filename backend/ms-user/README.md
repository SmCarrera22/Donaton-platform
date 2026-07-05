# MS User

Microservicio encargado de la gestión de usuarios dentro de la plataforma de donaciones.
Este servicio forma parte de una arquitectura basada en microservicios, donde cada componente mantiene su propia lógica de negocio, persistencia independiente y comunicación mediante APIs REST.

# Tecnologías utilizadas

- Java 25
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Security
- PostgreSQL
- Flyway
- Swagger / OpenAPI
- Lombok
- Gradle
- Docker
- Kubernetes
- GitHub Actions

# Responsabilidad del Microservicio

El microservicio `ms-user` tiene como objetivo administrar la información de usuarios del sistema.
Responsabilidades principales:
    - Crear usuarios.
    - Consultar usuarios.
    - Obtener usuarios por identificador.
    - Actualizar información.
    - Eliminar usuarios.
    - Obtener información necesaria para autenticación.

# Arquitectura aplicada

El proyecto utiliza patrones recomendados para aplicaciones Spring Boot.

## Repository Pattern

Flujo utilizado:

    Controller
    ↓
    Service
    ↓
    Repository

La lógica del negocio se encuentra en la capa Service.
Los Controller únicamente reciben solicitudes HTTP y delegan la operación correspondiente.

## DTO Pattern

Se utilizan objetos de transferencia para separar las entidades internas de los datos expuestos mediante API.
Estructura:

    Request DTO
    ↓
    Service
    ↓
    Response DTO

# Estructura del proyecto
    ms-user
    │
    ├── src/main/java/com/donaton/user
    │── controller
    │   └── UserController
    │── service
    │   └── UserService
    │── repository
    │   └── UserRepository
    │── entity
    │   └── User
    │── dto
    │   ├── UserCreateRequest
    │   ├── UserUpdateRequest
    │   ├── UserResponse
    │   └── UserAuthResponse
    │── exception
    │   ├── ApiError
    │   ├── GlobalExceptionHandler
    │   ├── ResourceNotFoundException
    │   └── DuplicateResourceException
    │── config
    │   ├── SecurityConfig
    │   ├── PasswordConfig
    │   └── OpenApiConfig
    └── resources
    └── db
    └── migration
    ├── V1__create_tables.sql
    └── V2__seed_data.sql
---

# Base de datos

Cada microservicio posee una base de datos independiente.

Motor utilizado:
    PostgreSQL

La conexión se configura mediante variables de entorno:
    DB_URL
    DB_USER
    DB_PASSWORD

---

# Migraciones Flyway

Flyway administra la creación y actualización del esquema de base de datos.
Ruta:
    src/main/resources/db/migration

Archivos Utilizados:
    V1__create_tables.sql
    V2__seed_data.sql

Al iniciar la aplicación, Flyway valida y ejecuta automáticamente las migraciones pendientes.

# Configuración Application.properties

Variables principales:
    spring.application.name=ms-user
    server.port=8081
    spring.datasource.url=${DB_URL}
    spring.datasource.username=${DB_USER}
    spring.datasource.password=${DB_PASSWORD}

La aplicación utiliza variables externas para facilitar despliegues mediante Docker y Kubernetes.

# Endpoints disponibles

    ## Crear usuario
    POST
        /users
            Ejemplo:
                ```json
                {
                "name":"Sebastian",
                "email":"usuario@test.com",
                "password":"123456"
                }

    ## Obtener usuarios
    GET
        /user

    ## Obtener usuario por ID
    GET
        /users/{id}

    ## Actualizar usuario
    PUT
        /users/{id}

    ## Eliminar usuario
    DELETE
        /users/{id}

## Documentación API
La documentación se genera utilizando Swagger/OpenAPI.

Disponible en:
    /swagger-ui/index.html

## Ejecución local
    Requisitos:
    
        * Java 25
        * Gradle
        * PostgreSQL

Ejecutar:
    ./gradlew bootRun

La aplicación estará disponible en:
http://localhost:8081

## Docker
Construcción de imagen:
    docker build -t ms-user .

Ejecutar:
    docker run -p 8081:8081 ms-user

Las variables de conexión deben ser entregadas mediante:
    DB_URL
    DB_USER
    DB_PASSWORD

## Kubernetes
Los archivos de despliegue se encuentran en:
    
    deploy/
    ├── deployment.yaml
    └── service.yaml

El Deployment administra los Pods del microservicio.
El Service expone la comunicación interna dentro del cluster.

Aplicar recursos:
    kubectl apply -f deploy/

Verificar:
kubectl get pods

## CI/CD
La automatización se encuentra en:
    deploy/ci.yml

Pipeline:

1. Descarga código fuente.
2. Configura Java 25.
3. Ejecuta pruebas.
4. Genera build.

Herramienta utilizada:
    GitHub Actions