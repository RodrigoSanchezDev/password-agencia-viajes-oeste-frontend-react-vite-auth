<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=Agencia%20de%20Viajes%20Oeste&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Sistema%20de%20Autenticación%20Full%20Stack&descSize=18&descAlignY=55">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=Agencia%20de%20Viajes%20Oeste&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Sistema%20de%20Autenticación%20Full%20Stack&descSize=18&descAlignY=55">
  <img alt="Header" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=Agencia%20de%20Viajes%20Oeste&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Sistema%20de%20Autenticación%20Full%20Stack&descSize=18&descAlignY=55" width="100%">
</picture>

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

**Sistema completo de autenticación con arquitectura cliente-servidor para gestión de sesiones seguras mediante JSON Web Tokens**

[Características](#-características) •
[Arquitectura](#-arquitectura) •
[Instalación](#-instalación) •
[API Reference](#-api-reference) •
[Documentación](#-documentación)

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

### ⚡ Rendimiento
- **Vite HMR** - Hot Module Replacement instantáneo
- **Lazy Loading** - Carga diferida de componentes
- **Optimized Build** - Bundle optimizado para producción
- **CORS Configurado** - Comunicación segura cross-origin

</td>
</tr>
<tr>
<td width="50%">

### 🎨 UI/UX
- **Diseño Responsive** - Adaptable a todos los dispositivos
- **Validación en Tiempo Real** - Feedback inmediato al usuario
- **Alertas Animadas** - Notificaciones de éxito/error
- **Accesibilidad WCAG** - Estándares de accesibilidad

</td>
<td width="50%">

### 🗄️ Persistencia
- **Almacenamiento JSON** - Base de datos local en archivo
- **LocalStorage** - Persistencia de sesión en cliente
- **Auto-sync** - Sincronización automática de datos
- **Backup Ready** - Estructura lista para respaldo

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
        B --> E[apiClient]
        E --> F[localStorage]
    end
    
    subgraph Servidor["⚙️ Backend (Node.js + Express)"]
        G[authRoutes] --> H[authController]
        H --> I[authMiddleware]
        H --> J[userModel]
        J --> K[(users.json)]
        I --> L[JWT Verify]
    end
    
    E <-->|HTTP/JSON| G
    
    style Cliente fill:#1a1a2e,stroke:#16213e,color:#fff
    style Servidor fill:#0f3460,stroke:#16213e,color:#fff
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
│   │   ├── 📂 features/            # Módulos por funcionalidad
│   │   ├── 📂 styles/              # Design tokens y estilos
│   │   └── 📂 utils/               # Utilidades y helpers
│   └── 📄 package.json
│
├── 📂 backend/                     # Servidor API REST
│   ├── 📂 src/
│   │   ├── 📂 controllers/         # Lógica de negocio
│   │   ├── 📂 middleware/          # Interceptores de peticiones
│   │   ├── 📂 models/              # Capa de datos
│   │   ├── 📂 routes/              # Definición de endpoints
│   │   └── 📂 utils/               # Funciones auxiliares
│   ├── 📂 data/                    # Almacenamiento persistente
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

### Endpoints de Autenticación

| Método | Endpoint | Descripción | Auth |
|:------:|----------|-------------|:----:|
| `POST` | `/api/auth/register` | Registro de nuevo usuario | ❌ |
| `POST` | `/api/auth/login` | Inicio de sesión | ❌ |
| `POST` | `/api/auth/logout` | Cierre de sesión | ✅ |
| `GET` | `/api/auth/me` | Obtener usuario actual | ✅ |
| `GET` | `/api/auth/verify` | Verificar validez del token | ✅ |
| `GET` | `/api/health` | Health check del servidor | ❌ |

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

---

## 📋 Documentación Técnica

### 🔄 Flujo de Autenticación

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
| `src/index.js` | Punto de entrada del servidor. Configura Express, middleware CORS, parseo JSON y monta las rutas de autenticación |
| `src/routes/authRoutes.js` | Define los endpoints REST para registro, login, logout y verificación de tokens |
| `src/controllers/authController.js` | Implementa la lógica de negocio: hashing de contraseñas, generación de JWT y gestión de blacklist |
| `src/middleware/authMiddleware.js` | Interceptor que valida el token JWT en headers Authorization y verifica blacklist |
| `src/models/userModel.js` | Capa de abstracción para operaciones CRUD sobre el archivo `users.json` |
| `src/utils/validation.js` | Funciones de validación: regex de email y políticas de contraseña |
| `data/users.json` | Almacenamiento persistente de usuarios en formato JSON |

### Frontend

| Archivo | Descripción Técnica |
|---------|---------------------|
| `src/api/client.ts` | Cliente HTTP configurado para comunicación con el backend. Gestiona headers Authorization y manejo de errores |
| `src/app/AppRoutes.tsx` | Configuración de React Router con rutas públicas y protegidas |
| `src/app/ProtectedRoute.tsx` | HOC que verifica existencia de token antes de renderizar rutas privadas |
| `src/features/auth/services/authService.ts` | Servicio que encapsula llamadas a la API y gestión del token en localStorage |
| `src/features/auth/pages/LoginPage.tsx` | Componente de página con formulario de login, validación y manejo de estados |
| `src/features/auth/pages/RegisterPage.tsx` | Componente de página con formulario de registro y redirección post-registro |
| `src/features/auth/pages/DashboardPage.tsx` | Vista protegida que muestra información del usuario autenticado |
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
