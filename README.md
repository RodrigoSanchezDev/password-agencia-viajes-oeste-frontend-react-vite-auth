<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=Agencia%20de%20Viajes%20Oeste&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Sistema%20de%20Autenticación%20y%20Gestión%20SSR&descSize=18&descAlignY=55">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=Agencia%20de%20Viajes%20Oeste&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Sistema%20de%20Autenticación%20y%20Gestión%20SSR&descSize=18&descAlignY=55">
  <img alt="Header" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=Agencia%20de%20Viajes%20Oeste&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Sistema%20de%20Autenticación%20y%20Gestión%20SSR&descSize=18&descAlignY=55" width="100%">
</picture>

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![GitHub OAuth](https://img.shields.io/badge/GitHub-OAuth_2.0-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/developers/apps/building-oauth-apps)
[![SSR](https://img.shields.io/badge/SSR-Server_Side_Rendering-22C55E?style=for-the-badge&logo=server&logoColor=white)](#-módulo-de-solicitudes-de-viaje-ssr)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

**Sistema completo de autenticación con arquitectura cliente-servidor, autenticación local, OAuth 2.0 con GitHub y gestión de solicitudes de viaje con Server-Side Rendering (SSR)**

[Características](#-características) •
[Arquitectura](#-arquitectura) •
[Instalación](#-instalación) •
[SSR](#-módulo-de-solicitudes-de-viaje-ssr) •
[API Reference](#-api-reference) •
[Documentación](#-documentación-técnica)

</div>

---

## 🚀 Características

<table>
<tr>
<td width="50%">

### 🔐 Seguridad
- **Hashing bcrypt** - Contraseñas cifradas con salt rounds
- **JWT Tokens** - Autenticación stateless con expiración
- **Token Blacklist** - Invalidación de tokens en logout
- **Rutas Protegidas** - Middleware de verificación

</td>
<td width="50%">

### 🐙 OAuth 2.0
- **GitHub OAuth** - Autenticación con terceros
- **Flujo Authorization Code** - Implementación segura
- **Unificación de Sesiones** - JWT para ambos proveedores
- **Callback Handling** - Gestión de redirecciones

</td>
</tr>
<tr>
<td width="50%">

### 🖥️ Server-Side Rendering (SSR)
- **HTML desde Servidor** - El backend genera el contenido
- **Estilos Inline** - CSS embebido en la respuesta
- **Estadísticas en Tiempo Real** - Calculadas en servidor
- **Validaciones Servidor** - Verificación de datos server-side

</td>
<td width="50%">

### 🎨 UI/UX
- **Diseño Responsive** - Adaptable a todos los dispositivos
- **Validación en Tiempo Real** - Feedback inmediato al usuario
- **Alertas Animadas** - Notificaciones de éxito/error
- **Accesibilidad WCAG** - Estándares de accesibilidad

</td>
</tr>
<tr>
<td width="50%">

### ✈️ Gestión de Viajes
- **Formulario Completo** - Todos los campos requeridos
- **Búsqueda Inteligente** - Selectores con filtro
- **Estados de Solicitud** - Pendiente/En Proceso/Finalizada
- **Persistencia JSON** - Almacenamiento local de datos

</td>
<td width="50%">

### ⚡ Rendimiento
- **Vite HMR** - Hot Module Replacement instantáneo
- **Lazy Loading** - Carga diferida de componentes
- **Optimized Build** - Bundle optimizado para producción
- **CORS Configurado** - Comunicación segura cross-origin

</td>
</tr>
</table>

---

## 🏗️ Arquitectura

```mermaid
graph TB
    subgraph Cliente["🖥️ Frontend (React + Vite)"]
        A[LoginPage] --> B[authService]
        C[RegisterPage] --> B
        D[DashboardPage] --> B
        GH[GitHubCallbackPage] --> B
        TR[TravelRequestListPage] --> TRS[travelRequestService]
        TRF[TravelRequestFormPage] --> TRS
        B --> E[apiClient]
        TRS --> E
        E --> F[localStorage]
    end
    
    subgraph OAuth["🐙 GitHub OAuth"]
        O[GitHub API]
    end
    
    subgraph Servidor["⚙️ Backend (Node.js + Express)"]
        G[authRoutes] --> H[authController]
        G --> HC[githubAuthController]
        TRR[travelRequestRoutes] --> TRC[travelRequestController]
        H --> I[authMiddleware]
        TRR --> I
        H --> J[userModel]
        HC --> J
        TRC --> TRM[travelRequestModel]
        HC --> O
        J --> K[(users.json)]
        TRM --> KT[(travel-requests.json)]
        I --> L[JWT Verify]
        TRC --> SSR[SSR HTML Generator]
    end
    
    E <-->|HTTP/JSON| G
    E <-->|HTTP/HTML| TRR
    
    style Cliente fill:#1a1a2e,stroke:#16213e,color:#fff
    style Servidor fill:#0f3460,stroke:#16213e,color:#fff
    style OAuth fill:#24292e,stroke:#16213e,color:#fff
    style SSR fill:#2d5016,stroke:#16213e,color:#fff
```

### 📁 Estructura del Proyecto

```
agencia-viajes-oeste/
│
├── 📂 frontend/                    # Aplicación Cliente
│   ├── 📂 src/
│   │   ├── 📂 api/                 # Capa de comunicación HTTP
│   │   ├── 📂 app/                 # Configuración de rutas
│   │   ├── 📂 components/          # Componentes reutilizables
│   │   │   └── 📂 ui/              # Select, RadioGroup, SearchSelect, etc.
│   │   ├── 📂 features/            # Módulos por funcionalidad
│   │   │   ├── 📂 auth/            # Autenticación (login, registro, OAuth)
│   │   │   │   ├── 📂 pages/       # LoginPage, RegisterPage, Dashboard
│   │   │   │   ├── 📂 services/    # authService.ts
│   │   │   │   └── 📂 types/       # Tipos TypeScript
│   │   │   └── 📂 travel-requests/ # Solicitudes de Viaje (SSR)
│   │   │       ├── 📂 pages/       # TravelRequestListPage, FormPage
│   │   │       ├── 📂 services/    # travelRequestService.ts
│   │   │       └── 📂 types/       # Tipos de solicitudes
│   │   ├── 📂 styles/              # Design tokens y estilos
│   │   └── 📂 utils/               # Utilidades y helpers
│   └── 📄 package.json
│
├── 📂 backend/                     # Servidor API REST
│   ├── 📂 src/
│   │   ├── 📂 controllers/         # Lógica de negocio
│   │   │   ├── 📄 authController.js
│   │   │   ├── 📄 githubAuthController.js
│   │   │   └── 📄 travelRequestController.js  # SSR Generator
│   │   ├── 📂 middleware/          # Interceptores de peticiones
│   │   ├── 📂 models/              # Capa de datos
│   │   │   ├── 📄 userModel.js
│   │   │   └── 📄 travelRequestModel.js
│   │   ├── 📂 routes/              # Definición de endpoints
│   │   │   ├── 📄 authRoutes.js
│   │   │   └── 📄 travelRequestRoutes.js
│   │   └── 📂 utils/               # Funciones auxiliares
│   ├── 📂 data/                    # Almacenamiento persistente
│   │   ├── 📄 users.json           # Usuarios registrados
│   │   └── 📄 travel-requests.json # Solicitudes de viaje
│   └── 📄 package.json
│
└── 📄 README.md
```

---

## 📦 Instalación

### Requisitos Previos

| Requisito | Versión Mínima |
|-----------|----------------|
| Node.js | v18.0.0+ |
| npm | v9.0.0+ |
| Git | v2.0.0+ |

### Configuración Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/RodrigoSanchezDev/password-agencia-viajes-oeste-frontend-react-vite-auth.git

# 2. Acceder al directorio
cd password-agencia-viajes-oeste-frontend-react-vite-auth

# 3. Instalar dependencias del backend
cd backend && npm install

# 4. Instalar dependencias del frontend
cd ../frontend && npm install
```

### Ejecución

<table>
<tr>
<td width="50%">

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
🚀 Servidor en `http://localhost:3001`

</td>
<td width="50%">

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```
🌐 App en `http://localhost:5173`

</td>
</tr>
</table>

---

## 📡 API Reference

### Endpoints de Autenticación Local

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `POST` | `/api/auth/register` | Registro de nuevo usuario | ❌ |
| `POST` | `/api/auth/login` | Inicio de sesión | ❌ |
| `POST` | `/api/auth/logout` | Cierre de sesión | ✅ |
| `GET` | `/api/auth/me` | Obtener usuario actual | ✅ |
| `GET` | `/api/auth/verify` | Verificar validez del token | ✅ |
| `GET` | `/api/health` | Health check del servidor | ❌ |

### Endpoints de GitHub OAuth

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/api/auth/github` | Obtener URL de autorización de GitHub | ❌ |
| `POST` | `/api/auth/github/callback` | Procesar callback OAuth y generar JWT | ❌ |

### Endpoints de Solicitudes de Viaje (SSR)

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/api/travel-requests` | Obtener todas las solicitudes | ✅ |
| `GET` | `/api/travel-requests/:id` | Obtener solicitud por ID | ✅ |
| `POST` | `/api/travel-requests` | Crear nueva solicitud | ✅ |
| `PUT` | `/api/travel-requests/:id` | Actualizar solicitud | ✅ |
| `PATCH` | `/api/travel-requests/:id/status` | Actualizar estado | ✅ |
| `DELETE` | `/api/travel-requests/:id` | Eliminar solicitud | ✅ |
| `GET` | `/api/travel-requests/stats` | Obtener estadísticas | ✅ |
| `GET` | `/api/travel-requests/ssr/list` | **HTML renderizado desde servidor (SSR)** | ✅ |

### Ejemplos de Peticiones

<details>
<summary><b>📝 Registro de Usuario</b></summary>

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "miPassword123"
  }'
```

**Respuesta (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "id": "uuid-generado",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
</details>

<details>
<summary><b>🔑 Inicio de Sesión</b></summary>

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "miPassword123"
  }'
```

**Respuesta (200 OK):**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com"
  }
}
```
</details>

<details>
<summary><b>🚪 Cierre de Sesión</b></summary>

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Respuesta (200 OK):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```
</details>

<details>
<summary><b>✈️ Crear Solicitud de Viaje</b></summary>

```bash
curl -X POST http://localhost:3001/api/travel-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "clientDni": "12345678-9",
    "clientName": "Juan Pérez",
    "clientEmail": "juan@email.com",
    "origin": "Santiago",
    "destination": "Buenos Aires",
    "tripType": "turismo",
    "departureDateTime": "2026-03-15T10:00",
    "returnDateTime": "2026-03-22T18:00",
    "status": "pendiente"
  }'
```

**Respuesta (201 Created):**
```json
{
  "message": "Solicitud de viaje registrada exitosamente",
  "data": {
    "id": 1001,
    "clientDni": "12345678-9",
    "clientName": "Juan Pérez",
    "status": "pendiente"
  }
}
```
</details>

<details>
<summary><b>🖥️ Obtener HTML SSR de Solicitudes</b></summary>

```bash
curl -X GET http://localhost:3001/api/travel-requests/ssr/list \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Respuesta (200 OK):**
```json
{
  "message": "HTML generado desde el servidor (SSR)",
  "html": "<div class='ssr-container'>...</div>",
  "stats": {
    "total": 5,
    "pending": 2,
    "inProgress": 1,
    "completed": 2
  }
}
```
</details>

---

## 📋 Documentación Técnica

### 🔄 Flujo de Autenticación Local

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as users.json

    U->>F: Ingresa credenciales
    F->>F: Validación cliente
    F->>B: POST /api/auth/login
    B->>DB: Buscar usuario
    DB-->>B: Usuario encontrado
    B->>B: Verificar password (bcrypt)
    B->>B: Generar JWT
    B-->>F: { token, user }
    F->>F: Guardar en localStorage
    F-->>U: Redirigir a Dashboard
```

### 🐙 Flujo de Autenticación GitHub OAuth

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant GH as GitHub API
    participant DB as users.json

    U->>F: Click "Continuar con GitHub"
    F->>B: GET /api/auth/github
    B-->>F: { authUrl }
    F->>GH: Redirect a authUrl
    U->>GH: Autoriza aplicación
    GH-->>F: Redirect con ?code=xxx
    F->>B: POST /api/auth/github/callback { code }
    B->>GH: Exchange code por access_token
    GH-->>B: { access_token }
    B->>GH: GET /user (con token)
    GH-->>B: { id, login, email, avatar_url }
    B->>DB: Buscar/Crear usuario GitHub
    B->>B: Generar JWT
    B-->>F: { token, user }
    F->>F: Guardar en localStorage
    F-->>U: Redirigir a Dashboard
```

### ✈️ Flujo Server-Side Rendering (SSR)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as travel-requests.json

    U->>F: Accede a Solicitudes de Viaje
    F->>B: GET /api/travel-requests/ssr/list
    B->>DB: Lee solicitudes
    DB-->>B: Array de solicitudes
    B->>B: Genera HTML completo con estilos
    B-->>F: { html, stats }
    F->>F: dangerouslySetInnerHTML
    F-->>U: Muestra contenido SSR
```

### 🔐 Seguridad Implementada

| Característica | Implementación |
|----------------|----------------|
| **Hashing** | bcrypt con 10 salt rounds |
| **JWT** | Expiración configurable (default: 24h) |
| **Blacklist** | Set en memoria para tokens invalidados |
| **Validación** | Email regex + longitud mínima password |
| **CORS** | Whitelist de orígenes permitidos |

### 📊 Estructura de Datos

**Usuario en `users.json`:**
```json
{
  "id": "094f08b6-74f0-4d4b-9259-f1ae491aab12",
  "email": "usuario@ejemplo.com",
  "password": "$2a$10$WUkGUq4jcmoAVd8/Jyjrk...",
  "createdAt": "2026-01-20T01:44:28.514Z",
  "lastLogin": "2026-01-20T01:44:38.071Z"
}
```

**Solicitud de Viaje en `travel-requests.json`:**
```json
{
  "id": 1001,
  "clientDni": "12345678-9",
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "origin": "Santiago",
  "destination": "Buenos Aires",
  "tripType": "turismo",
  "departureDateTime": "2026-03-15T10:00",
  "returnDateTime": "2026-03-22T18:00",
  "status": "pendiente",
  "createdAt": "2026-01-20T15:30:00.000Z",
  "updatedAt": "2026-01-20T15:30:00.000Z"
}
```

---

## 🛠️ Stack Tecnológico

<div align="center">

### Frontend
[![React](https://skillicons.dev/icons?i=react)](https://react.dev/)
[![TypeScript](https://skillicons.dev/icons?i=typescript)](https://www.typescriptlang.org/)
[![Vite](https://skillicons.dev/icons?i=vite)](https://vitejs.dev/)
[![CSS](https://skillicons.dev/icons?i=css)](https://developer.mozilla.org/en-US/docs/Web/CSS)

### Backend
[![NodeJS](https://skillicons.dev/icons?i=nodejs)](https://nodejs.org/)
[![Express](https://skillicons.dev/icons?i=express)](https://expressjs.com/)

### Herramientas
[![Git](https://skillicons.dev/icons?i=git)](https://git-scm.com/)
[![GitHub](https://skillicons.dev/icons?i=github)](https://github.com/)
[![VSCode](https://skillicons.dev/icons?i=vscode)](https://code.visualstudio.com/)

</div>

---

## 📂 Documentación de Archivos

### Backend

| Archivo | Descripción Técnica |
|---------|---------------------|
| `src/index.js` | Punto de entrada del servidor. Configura Express, middleware CORS, parseo JSON y monta las rutas de autenticación y solicitudes |
| `src/routes/authRoutes.js` | Define los endpoints REST para autenticación local y OAuth con GitHub |
| `src/routes/travelRequestRoutes.js` | Define los endpoints REST para solicitudes de viaje y SSR |
| `src/controllers/authController.js` | Implementa la lógica de negocio: hashing de contraseñas, generación de JWT y gestión de blacklist |
| `src/controllers/githubAuthController.js` | Controlador para OAuth 2.0 con GitHub: genera URL de autorización e intercambia código por token |
| `src/controllers/travelRequestController.js` | Controlador de solicitudes de viaje: CRUD completo y generación de HTML SSR |
| `src/middleware/authMiddleware.js` | Interceptor que valida el token JWT en headers Authorization y verifica blacklist |
| `src/models/userModel.js` | Capa de abstracción para operaciones CRUD sobre usuarios locales y GitHub |
| `src/models/travelRequestModel.js` | Capa de datos para solicitudes de viaje con ID auto-incremental y persistencia JSON |
| `src/utils/validation.js` | Funciones de validación: regex de email y políticas de contraseña |
| `data/users.json` | Almacenamiento persistente de usuarios (locales y GitHub) en formato JSON |
| `data/travel-requests.json` | Almacenamiento persistente de solicitudes de viaje en formato JSON |

### Frontend

| Archivo | Descripción Técnica |
|---------|---------------------|
| `src/api/client.ts` | Cliente HTTP configurado para comunicación con el backend. Gestiona headers Authorization y manejo de errores |
| `src/app/AppRoutes.tsx` | Configuración de React Router con rutas públicas, protegidas y callback de OAuth |
| `src/app/ProtectedRoute.tsx` | HOC que verifica existencia de token antes de renderizar rutas privadas |
| `src/features/auth/services/authService.ts` | Servicio que encapsula llamadas a la API, autenticación local y OAuth con GitHub |
| `src/features/auth/pages/LoginPage.tsx` | Componente de página con formulario de login y botón de GitHub OAuth |
| `src/features/auth/pages/RegisterPage.tsx` | Componente de página con formulario de registro y confirmación de contraseña |
| `src/features/auth/pages/GitHubCallbackPage.tsx` | Componente que procesa el callback de GitHub OAuth y gestiona estados de carga/error |
| `src/features/auth/pages/DashboardPage.tsx` | Vista protegida que muestra información del usuario (local o GitHub) |
| `src/features/travel-requests/services/travelRequestService.ts` | Servicio para comunicación con API de solicitudes de viaje y endpoint SSR |
| `src/features/travel-requests/pages/TravelRequestListPage.tsx` | Página que muestra solicitudes de viaje con renderizado SSR desde el servidor |
| `src/features/travel-requests/pages/TravelRequestFormPage.tsx` | Formulario completo para crear/editar solicitudes de viaje con validaciones |
| `src/features/travel-requests/types/index.ts` | Interfaces TypeScript para solicitudes de viaje (TravelRequest, TravelRequestStats) |
| `src/components/ui/Select.tsx` | Componente select reutilizable con soporte para opciones y validación |
| `src/components/ui/RadioGroup.tsx` | Componente de radio buttons reutilizable para selección única |
| `src/components/ui/SearchSelect.tsx` | Componente select con filtro de búsqueda para listas grandes de opciones |
| `src/utils/storage.ts` | Helpers para operaciones con localStorage (get/set/clear token) |
| `src/utils/validation.ts` | Funciones de validación reutilizables para formularios |

---

## 👨‍💻 Autor

<div align="center">

<img src="https://avatars.githubusercontent.com/RodrigoSanchezDev" width="120" style="border-radius: 50%;" alt="Rodrigo Sánchez"/>

### **Rodrigo Sánchez**
#### Full Stack Developer

<br/>

[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-sanchezdev.com-9B59B6?style=for-the-badge)](https://sanchezdev.com/)
[![Email](https://img.shields.io/badge/📧_Email-Rodrigo@sanchezdev.com-D44638?style=for-the-badge)](mailto:Rodrigo@sanchezdev.com)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectemos-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sanchezdev)
[![CV](https://img.shields.io/badge/📄_Currículum-Ver_CV-4CAF50?style=for-the-badge)](https://www.sanchezdev.com/documents/CV-Espanol.html)

[![Agenda](https://img.shields.io/badge/📅_Agenda_una_Llamada-Calendly-7C3AED?style=for-the-badge)](https://www.sanchezdev.com/es/agenda)

<br/>

*¿Tienes una idea de proyecto? Conversemos cómo puedo ayudarte.*

</div>

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=120&section=footer">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=120&section=footer">
  <img alt="Footer" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=120&section=footer" width="100%">
</picture>
