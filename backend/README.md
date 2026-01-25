<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=180&section=header&text=Backend%20API&fontSize=50&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Node.js%20%2B%20Express%20%2B%20JWT%20Authentication&descSize=18&descAlignY=55">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=180&section=header&text=Backend%20API&fontSize=50&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Node.js%20%2B%20Express%20%2B%20JWT%20Authentication&descSize=18&descAlignY=55">
  <img alt="Header" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=180&section=header&text=Backend%20API&fontSize=50&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Node.js%20%2B%20Express%20%2B%20JWT%20Authentication&descSize=18&descAlignY=55" width="100%">
</picture>

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![bcrypt](https://img.shields.io/badge/bcrypt-2.4.3-4A154B?style=for-the-badge)](https://www.npmjs.com/package/bcryptjs)

[![GitHub OAuth](https://img.shields.io/badge/GitHub-OAuth_2.0-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/developers/apps/building-oauth-apps)
[![Architecture](https://img.shields.io/badge/Architecture-REST_API-FF6B6B?style=for-the-badge)](https://restfulapi.net/)
[![Storage](https://img.shields.io/badge/Storage-JSON_File-F7931E?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](../LICENSE)

<br/>

**Servidor RESTful para autenticación de usuarios con autenticación local y OAuth 2.0 (GitHub), gestión de sesiones mediante JSON Web Tokens y almacenamiento persistente en archivo local**

[Características](#-características) •
[Arquitectura](#-arquitectura) •
[Instalación](#-instalación) •
[API Endpoints](#-api-endpoints) •
[Documentación](#-documentación-de-archivos)

</div>

---

## 🚀 Características

<table>
<tr>
<td width="50%">

### 🔐 Seguridad
- **bcrypt hashing** con 10 salt rounds
- **JWT** con expiración configurable
- **Token Blacklist** para invalidación
- **Validación** de inputs en servidor

</td>
<td width="50%">

### 🐙 OAuth 2.0
- **GitHub OAuth** integración completa
- **Authorization Code Flow** seguro
- **Token Exchange** con GitHub API
- **Usuarios unificados** en JWT

</td>
</tr>
<tr>
<td width="50%">

### 🗄️ Persistencia
- **Archivo JSON** como base de datos
- **UUID** para identificadores únicos
- **Timestamps** automáticos
- **Usuarios locales y GitHub**

</td>
<td width="50%">

### 🛡️ Middleware
- **Autenticación** JWT verificada
- **Error handling** centralizado
- **Request parsing** JSON
- **Route protection**

</td>
</tr>
</table>

---

## 🏗️ Arquitectura

```mermaid
graph LR
    subgraph Request["📨 HTTP Request"]
        A[Cliente]
    end
    
    subgraph Middleware["🛡️ Middleware Layer"]
        B[CORS]
        C[JSON Parser]
        D[Logger]
        E[Auth Middleware]
    end
    
    subgraph Routes["🛤️ Routes"]
        F[/api/auth/*]
        G[/api/auth/github/*]
        H2[/api/health]
    end
    
    subgraph Controller["🎮 Controllers"]
        H[authController]
        GC[githubAuthController]
    end
    
    subgraph External["🐙 GitHub API"]
        GH[GitHub OAuth]
    end
    
    subgraph Model["📊 Model"]
        I[userModel]
    end
    
    subgraph Storage["💾 Storage"]
        J[(users.json)]
    end
    
    A --> B --> C --> D --> F
    A --> B --> C --> D --> G
    F --> E --> H
    G --> GC
    GC --> GH
    H2 --> H
    H --> I --> J
    GC --> I
    
    style Request fill:#1e3a5f,stroke:#16213e,color:#fff
    style Middleware fill:#2d4a6f,stroke:#16213e,color:#fff
    style Routes fill:#3d5a8f,stroke:#16213e,color:#fff
    style Controller fill:#4d6a9f,stroke:#16213e,color:#fff
    style External fill:#24292e,stroke:#16213e,color:#fff
    style Model fill:#5d7abf,stroke:#16213e,color:#fff
    style Storage fill:#6d8acf,stroke:#16213e,color:#fff
```

### 📁 Estructura del Proyecto

```
backend/
│
├── 📂 src/
│   ├── 📄 index.js                    # Entry point del servidor
│   │
│   ├── 📂 controllers/
│   │   ├── 📄 authController.js       # Lógica de autenticación local
│   │   └── 📄 githubAuthController.js # Lógica de OAuth con GitHub
│   │
│   ├── 📂 middleware/
│   │   └── 📄 authMiddleware.js       # Verificación de JWT
│   │
│   ├── 📂 models/
│   │   └── 📄 userModel.js            # CRUD usuarios (local + GitHub)
│   │
│   ├── 📂 routes/
│   │   └── 📄 authRoutes.js           # Endpoints auth + OAuth
│   │
│   └── 📂 utils/
│       └── 📄 validation.js           # Funciones de validación
│
├── 📂 data/
│   └── 📄 users.json                  # Base de datos local
│
├── 📄 .env                            # Variables de entorno (GitHub OAuth)
├── 📄 .env.example              # Plantilla de variables
├── 📄 .gitignore
└── 📄 package.json
```

---

## 📦 Instalación

### Requisitos

| Dependencia | Versión |
|-------------|---------|
| Node.js | ≥ 18.0.0 |
| npm | ≥ 9.0.0 |

### Configuración

```bash
# 1. Navegar al directorio
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env

# 4. Iniciar en desarrollo
npm run dev

# 5. Iniciar en producción
npm start
```

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `agencia_viajes_oeste_secret_key_2024` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `GITHUB_CLIENT_ID` | Client ID de la aplicación OAuth de GitHub | - |
| `GITHUB_CLIENT_SECRET` | Client Secret de la aplicación OAuth de GitHub | - |
| `GITHUB_CALLBACK_URL` | URL de callback para GitHub OAuth | `http://localhost:5173/auth/github/callback` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Endpoints Disponibles

#### 🔐 Autenticación Local

| Método | Endpoint | Descripción | Body | Auth |
|:------:|----------|-------------|------|:----:|
| `POST` | `/auth/register` | Registrar usuario | `{ email, password }` | ❌ |
| `POST` | `/auth/login` | Iniciar sesión | `{ email, password }` | ❌ |
| `POST` | `/auth/logout` | Cerrar sesión | - | ✅ |
| `GET` | `/auth/me` | Usuario actual | - | ✅ |
| `GET` | `/auth/verify` | Verificar token | - | ✅ |
| `GET` | `/health` | Health check | - | ❌ |

#### 🐙 Autenticación con GitHub OAuth

| Método | Endpoint | Descripción | Body | Auth |
|:------:|----------|-------------|------|:----:|
| `GET` | `/auth/github` | Obtener URL de autorización | - | ❌ |
| `POST` | `/auth/github/callback` | Procesar callback de GitHub | `{ code }` | ❌ |

### Respuestas de Error

| Código | Significado |
|--------|-------------|
| `400` | Datos de entrada inválidos |
| `401` | No autenticado / Token inválido |
| `403` | Token expirado |
| `404` | Recurso no encontrado |
| `409` | Conflicto (email ya existe) |
| `500` | Error interno del servidor |

---

## 📋 Documentación de Archivos

### `src/index.js`
**Punto de entrada del servidor Express**

```javascript
// Responsabilidades:
// - Cargar variables de entorno con dotenv
// - Configurar middleware CORS para frontend
// - Parsear JSON en request body
// - Montar rutas de autenticación
// - Manejar errores globalmente
// - Iniciar servidor HTTP
```

| Función | Descripción |
|---------|-------------|
| `app.use(cors())` | Habilita Cross-Origin Resource Sharing |
| `app.use(express.json())` | Parsea body como JSON |
| `app.use('/api/auth', authRoutes)` | Monta rutas de autenticación |
| `app.listen()` | Inicia servidor en puerto configurado |

---

### `src/controllers/authController.js`
**Controlador con la lógica de negocio de autenticación local**

| Método | Descripción Técnica |
|--------|---------------------|
| `register()` | Valida email/password, verifica unicidad, hashea con bcrypt, crea usuario en JSON, genera JWT y retorna token |
| `login()` | Busca usuario por email, compara hash con bcrypt.compare(), actualiza lastLogin, genera JWT |
| `logout()` | Extrae token del header Authorization, lo agrega al Set blacklist para invalidación |
| `getCurrentUser()` | Detecta tipo de usuario (local/GitHub) via `req.user` y retorna datos correspondientes |
| `verifyToken()` | Simplemente confirma que el middleware validó el token exitosamente |
| `isTokenBlacklisted()` | Función auxiliar que verifica si un token está en el Set de blacklist |

---

### `src/controllers/githubAuthController.js`
**Controlador para autenticación OAuth 2.0 con GitHub**

| Método | Descripción Técnica |
|--------|---------------------|
| `getGithubAuthUrl()` | Construye y retorna la URL de autorización de GitHub con client_id, redirect_uri y scope |
| `handleGithubCallback()` | Recibe el código de autorización, lo intercambia por access_token con GitHub API, obtiene datos del usuario, crea/actualiza usuario en JSON y genera JWT |

---

### `src/middleware/authMiddleware.js`
**Middleware de verificación de tokens JWT**

```javascript
// Flujo de authenticateToken():
// 1. Extrae token del header Authorization (formato: "Bearer <token>")
// 2. Verifica si el token está en la blacklist
// 3. Valida firma y expiración con jwt.verify()
// 4. Inyecta payload decodificado en req.user
// 5. Llama a next() o retorna error 401/403
```

| Función | Uso |
|---------|-----|
| `authenticateToken` | Middleware requerido para rutas protegidas |
| `optionalAuth` | Middleware que no bloquea si no hay token |

---

### `src/models/userModel.js`
**Capa de abstracción para operaciones con usuarios (locales y GitHub)**

| Método | Operación | Descripción |
|--------|-----------|-------------|
| `getAll()` | READ | Retorna array de todos los usuarios |
| `findById(id)` | READ | Busca usuario por UUID |
| `findByEmail(email)` | READ | Busca usuario por email (case insensitive) |
| `findByGithubId(githubId)` | READ | Busca usuario por ID de GitHub |
| `create(userData)` | CREATE | Genera UUID, timestamps, guarda en JSON |
| `createGithubUser(githubData)` | CREATE | Crea usuario OAuth con datos de GitHub (id, login, email, avatar) |
| `update(id, updates)` | UPDATE | Actualiza campos del usuario |
| `updateLastLogin(id)` | UPDATE | Actualiza timestamp de último login |
| `delete(id)` | DELETE | Elimina usuario del array |

**Funciones internas:**
- `ensureDataFile()` - Crea directorio y archivo si no existen
- `readUsers()` - Lee y parsea users.json
- `saveUsers()` - Serializa y escribe users.json

---

### `src/routes/authRoutes.js`
**Definición de rutas de autenticación local y OAuth**

```javascript
// Rutas públicas - Autenticación Local:
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas públicas - GitHub OAuth:
router.get('/github', githubAuthController.getGithubAuthUrl);
router.post('/github/callback', githubAuthController.handleGithubCallback);

// Rutas protegidas (con authenticateToken):
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.get('/verify', authenticateToken, authController.verifyToken);
```

---

### `src/utils/validation.js`
**Funciones de validación reutilizables**

| Función | Validación |
|---------|------------|
| `validateEmail(email)` | Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `validatePassword(password)` | Longitud mínima: 6 caracteres |
| `validateRequired(value)` | Valor no vacío después de trim |

---

### `data/users.json`
**Almacenamiento persistente de usuarios (locales y GitHub)**

```json
{
  "users": [
    {
      "id": "uuid-v4",
      "email": "usuario@ejemplo.com",
      "password": "$2a$10$...",
      "createdAt": "ISO-8601",
      "lastLogin": "ISO-8601"
    },
    {
      "id": "uuid-v4",
      "githubId": 12345678,
      "username": "github-username",
      "email": "usuario@github.com",
      "avatarUrl": "https://avatars.githubusercontent.com/...",
      "provider": "github",
      "createdAt": "ISO-8601",
      "lastLogin": "ISO-8601"
    }
  ]
}
```

---

## 🔧 Scripts Disponibles

```bash
npm start      # Ejecuta node src/index.js
npm run dev    # Ejecuta nodemon src/index.js (auto-reload)
```

---

## 🛡️ Seguridad

| Medida | Implementación |
|--------|----------------|
| **Password Hashing** | bcrypt con 10 salt rounds |
| **Token Signing** | HS256 con secret configurable |
| **Token Expiry** | Configurable via JWT_EXPIRES_IN |
| **Token Blacklist** | Set en memoria para logout |
| **Input Validation** | Server-side antes de procesar |
| **CORS** | Whitelist de orígenes |

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

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](../LICENSE) para más detalles.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=120&section=footer">
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=120&section=footer">
  <img alt="Footer" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,4,5,6&height=120&section=footer" width="100%">
</picture>
