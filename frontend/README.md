# Frontend de Donaton

Este frontend es la interfaz web de Donaton. Está construido con Next.js y se encarga de mostrar la experiencia pública del proyecto: inicio, registro, inicio de sesión y la página informativa “Acerca de nosotros”. Su foco principal es permitir que una persona se registre, inicie sesión y navegue una interfaz simple para conectar con las campañas y el flujo de donaciones.

## Qué hace

- Presenta la landing principal con acceso a registro, inicio de sesión y la sección informativa.
- Permite crear una cuenta con validaciones de formulario en cliente.
- Permite iniciar sesión con validaciones y mensajes de estado.
- Maneja una sesión ligera en memoria para reflejar si el usuario está autenticado.
- Consume el backend a través de un BFF usando rutas `api` reescritas por Next.js.
- Incluye pruebas de UI con Vitest y Testing Library para los formularios principales.

## Cómo funciona

El proyecto usa el App Router de Next.js, por lo que cada pantalla vive dentro de `app/` como una ruta independiente.

El flujo de autenticación es el siguiente:

1. El usuario completa el formulario de registro o inicio de sesión.
2. Los hooks del frontend validan los campos antes de enviar.
3. `services/authService.ts` centraliza las llamadas HTTP.
4. `lib/bff.ts` envía `POST` a `/api/register` y `/api/login`.
5. `next.config.ts` reescribe esas rutas hacia el BFF configurado en `BFF_URL`.
6. Si el envío es exitoso, el frontend guarda una sesión ligera en memoria con `lib/session.ts`.
7. La página principal lee esa sesión para cambiar el contenido mostrado.

Importante: la sesión aquí no se persiste en localStorage ni en cookies. Es un estado temporal en memoria, suficiente para esta interfaz y para la navegación dentro de la misma ejecución del navegador.

## Cómo está construido

El frontend está organizado por responsabilidades:

- `app/`: rutas y pantallas principales.
- `components/`: componentes reutilizables de UI y de contenido.
- `hooks/`: lógica de formularios, sesión y efectos de navegación.
- `lib/`: utilidades generales, especialmente la capa base para hablar con el BFF y la sesión.
- `services/`: servicios de dominio que encapsulan el acceso a autenticación.
- `public/`: recursos estáticos.

Puntos clave de la implementación:

- La página principal cambia según exista o no una sesión activa.
- Los formularios de login y registro usan componentes controlados y validación manual.
- La pantalla “Acerca de nosotros” reutiliza `Header`, `FeatureCard` y `Footer` como piezas compartidas.
- Las llamadas de autenticación no se hacen directo al backend desde los componentes, sino desde una capa de servicio.

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React para iconografía
- Vitest + Testing Library para pruebas

## Requisitos

- Node.js instalado.
- Un gestor de paquetes compatible con el proyecto. El `package.json` contiene scripts para `npm`, pero también puedes usar `pnpm` o `yarn` si tu entorno está configurado para ello.
- El BFF accesible desde la URL configurada en `BFF_URL`.

## Configuración de API

Por defecto, `next.config.ts` reescribe todas las llamadas que empiezan con `/api/` hacia la URL definida en la variable de entorno `BFF_URL`.

Si no defines `BFF_URL`, el frontend usa `http://localhost:8082`.

Ejemplo:

```bash
set BFF_URL=http://localhost:8082
```

En PowerShell:

```powershell
$env:BFF_URL = "http://localhost:8082"
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

## Ejecutar en local

1. Instala dependencias.
2. Asegúrate de que el BFF esté levantado y accesible.
3. Inicia el frontend con `npm run dev`.
4. Abre la aplicación en `http://localhost:3000`.

## Pruebas

El proyecto incluye pruebas de interfaz para login y registro en `app/login/login.test.tsx` y `app/register/register.test.tsx`.

Para ejecutarlas:

```bash
npm run test
```

## Estructura principal

```text
app/
components/
hooks/
lib/
services/
public/
```

## Notas

- La navegación y la autenticación están pensadas para funcionar principalmente del lado del cliente.
- El frontend ya no es una plantilla genérica de Next.js: está adaptado al flujo de Donaton.

