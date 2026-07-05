# Donaton-Proyect

Proyecto web para gestionar donaciones y conectar personas con causas solidarias. Este desarrollo fue realizado en grupo y se organizo en frontend, backend y un BFF para separar responsabilidades y facilitar el mantenimiento del sistema.

## Que incluye el proyecto

La idea principal de Donaton es que una persona pueda registrarse, iniciar sesion y acceder a una interfaz pensada para gestionar donaciones de forma ordenada. Ademas, el proyecto separa los servicios de usuarios, donaciones y comunicacion con el frontend.

Lo que esta implementado es lo siguiente:

- Pagina principal con una presentacion general del proyecto y opciones segun el estado de sesion.
- Formulario de inicio de sesion con validacion de campos y conexion al BFF.
- Formulario de registro con validacion completa y conexion al BFF.
- Pagina "Acerca de nosotros" con informacion del proyecto.
- Servicio de usuarios con CRUD y login.
- Servicio de donaciones con CRUD completo.
- BFF para recibir peticiones del frontend y reenviarlas a los servicios internos.
- Manejo de sesion en el frontend para mostrar contenido segun el usuario activo.

## Tecnologias usadas

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React para iconos
- ESLint

### Backend

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Security
- Spring Data JPA
- Flyway
- PostgreSQL
- Lombok
- Spring Cloud OpenFeign
- Springdoc OpenAPI
- dotenv-java

### Herramientas

- Gradle
- npm / pnpm para el frontend
- Git y GitHub para el control de versiones

## Estructura del proyecto

```text
frontend/             Aplicacion web hecha con Next.js
bff/                  Capa intermedia para conectar frontend y backend
backend/MS-Usuarios/  Microservicio de usuarios
backend/MS-Donations/ Microservicio de donaciones
```

## Como funciona

El frontend es la parte visible de la aplicacion. Desde ahi se puede entrar al inicio, al registro, al login y a la seccion informativa. Cuando el usuario se registra o inicia sesion, la app guarda una sesion local para cambiar la interfaz segun si ya hay un usuario activo o no.

El BFF actua como puente entre el frontend y los microservicios. El frontend no habla directamente con los servicios internos, sino que envia las peticiones al BFF, y este las distribuye al backend correspondiente.

El backend esta dividido en dos servicios principales:

- MS-Usuarios: administra usuarios, autenticacion y operaciones basicas de usuario.
- MS-Donations: administra las donaciones y sus operaciones CRUD.

## Funcionalidades del frontend

- Pagina principal con un diseno visual para orientar al usuario.
- Botones para registrarse, iniciar sesion y cerrar sesion.
- Validaciones en los formularios para evitar datos incompletos o invalidos.
- Interfaz responsiva con estilos hechos en Tailwind.
- Pagina informativa sobre el proyecto y su proposito.

## Funcionalidades del backend

### MS-Usuarios

- Registrar usuarios.
- Listar usuarios.
- Buscar usuarios por ID.
- Actualizar usuarios.
- Eliminar usuarios.
- Iniciar sesion con correo y contrasena.

### MS-Donations

- Crear donaciones.
- Listar donaciones.
- Buscar donaciones por ID.
- Actualizar donaciones.
- Eliminar donaciones.

### BFF

- Recibir registro de usuario.
- Recibir inicio de sesion.
- Recibir creacion de donaciones.
- Consultar usuarios por ID.

## Ejecucion local

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Si prefieres npm:

```bash
cd frontend
npm install
npm run dev
```

### Backend

Cada servicio backend se ejecuta por separado:

```bash
cd backend/MS-Usuarios
./gradlew bootRun
```

```bash
cd backend/MS-Donations
./gradlew bootRun
```

```bash
cd bff
./gradlew bootRun
```

En Windows tambien puedes usar `gradlew.bat`.

## Datos de configuracion

El frontend usa una variable de entorno llamada `BFF_URL` para apuntar al BFF. Si no se define, usa por defecto `http://localhost:8082`.

Cada backend tiene su propia configuracion de aplicacion y sus conexiones a base de datos y servicios internos.

## Trabajo en equipo

Este proyecto fue desarrollado en grupo. Cada integrante participo en una parte del sistema, apoyando el desarrollo de la interfaz, la conexion con el BFF y la implementacion de los servicios backend. La organizacion por capas permitio dividir mejor las tareas y avanzar de forma ordenada.