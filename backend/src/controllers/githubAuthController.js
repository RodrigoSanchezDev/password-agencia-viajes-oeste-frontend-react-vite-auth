/**
 * Controlador de autenticación con GitHub OAuth
 * Maneja el flujo de autenticación con GitHub
 */

const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Configuración de GitHub OAuth
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5173/auth/github/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Genera la URL de autorización de GitHub
 * GET /api/auth/github
 */
exports.getGithubAuthUrl = (req, res) => {
  try {
    if (!GITHUB_CLIENT_ID) {
      return res.status(500).json({
        error: 'Configuración incompleta',
        message: 'GitHub OAuth no está configurado correctamente'
      });
    }

    const scope = 'user:email read:user';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_CALLBACK_URL)}&scope=${encodeURIComponent(scope)}`;

    console.log('[GitHub Auth] Redirigiendo a GitHub para autenticación');
    
    res.json({ authUrl });
  } catch (error) {
    console.error('[GitHub Auth] Error al generar URL:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al iniciar autenticación con GitHub'
    });
  }
};

/**
 * Maneja el callback de GitHub OAuth
 * POST /api/auth/github/callback
 */
exports.handleGithubCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Código faltante',
        message: 'No se recibió el código de autorización de GitHub'
      });
    }

    console.log('[GitHub Auth] Procesando callback con código de autorización');

    // 1. Intercambiar código por access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: GITHUB_CALLBACK_URL
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('[GitHub Auth] Error al obtener token:', tokenData.error_description);
      return res.status(401).json({
        error: 'Error de autenticación',
        message: tokenData.error_description || 'No se pudo autenticar con GitHub'
      });
    }

    const accessToken = tokenData.access_token;
    console.log('[GitHub Auth] Token de acceso obtenido exitosamente');

    // 2. Obtener información del usuario de GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Agencia-Viajes-Oeste'
      }
    });

    if (!userResponse.ok) {
      throw new Error('No se pudo obtener información del usuario de GitHub');
    }

    const githubUser = await userResponse.json();
    console.log('[GitHub Auth] Usuario de GitHub obtenido:', githubUser.login);

    // 3. Obtener email del usuario (puede estar oculto)
    let userEmail = githubUser.email;
    
    if (!userEmail) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Agencia-Viajes-Oeste'
        }
      });

      if (emailsResponse.ok) {
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find(e => e.primary) || emails[0];
        userEmail = primaryEmail?.email;
      }
    }

    // 4. Buscar o crear usuario en nuestra base de datos
    let user = userModel.findByGithubId(githubUser.id.toString());
    
    if (!user) {
      // Verificar si existe un usuario con el mismo email
      if (userEmail) {
        user = userModel.findByEmail(userEmail);
        if (user) {
          // Vincular cuenta de GitHub al usuario existente
          user = userModel.linkGithubAccount(user.id, {
            githubId: githubUser.id.toString(),
            githubUsername: githubUser.login,
            avatarUrl: githubUser.avatar_url,
            name: githubUser.name
          });
          console.log('[GitHub Auth] Cuenta de GitHub vinculada a usuario existente:', userEmail);
        }
      }
      
      if (!user) {
        // Crear nuevo usuario con datos de GitHub
        user = userModel.createGithubUser({
          githubId: githubUser.id.toString(),
          githubUsername: githubUser.login,
          email: userEmail || `${githubUser.login}@github.local`,
          name: githubUser.name || githubUser.login,
          avatarUrl: githubUser.avatar_url
        });
        console.log('[GitHub Auth] Nuevo usuario creado desde GitHub:', githubUser.login);
      }
    } else {
      // Actualizar información del usuario
      userModel.updateGithubInfo(user.id, {
        githubUsername: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        name: githubUser.name
      });
      userModel.updateLastLogin(user.id);
      console.log('[GitHub Auth] Usuario existente actualizado:', githubUser.login);
    }

    // 5. Generar JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        provider: 'github',
        githubUsername: githubUser.login
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('[GitHub Auth] Login exitoso para:', githubUser.login);

    res.json({
      message: 'Autenticación con GitHub exitosa',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || githubUser.name || githubUser.login,
        avatarUrl: user.avatarUrl || githubUser.avatar_url,
        githubUsername: githubUser.login,
        provider: 'github'
      }
    });

  } catch (error) {
    console.error('[GitHub Auth] Error en callback:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al procesar la autenticación con GitHub'
    });
  }
};
