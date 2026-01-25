import { apiClient } from '../../../api/client';
import type { LoginRequest, RegisterRequest, AuthResponse, GitHubAuthUrlResponse, GitHubAuthResponse, GitHubUser } from '../types';
import { setToken, clearToken, getToken } from '../../../utils/storage';

// Clave para almacenar datos del usuario de GitHub
const GITHUB_USER_KEY = 'github_user';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/login', credentials);
      console.log('[AuthService] Guardando token en localStorage:', response.token);
      setToken(response.token);
      // Limpiar datos de GitHub si existían
      localStorage.removeItem(GITHUB_USER_KEY);
      console.log('[AuthService] Token guardado. Verificando:', getToken());
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
      throw new Error('Error al iniciar sesión. Por favor intenta nuevamente.');
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/register', data);
      console.log('[AuthService] Registro exitoso, token recibido:', response.token);
      // No guardamos el token en registro, el usuario debe hacer login
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error al registrar usuario. Verifica tus datos.');
      }
      throw new Error('Error al registrar usuario. Por favor intenta nuevamente.');
    }
  },

  async logout(): Promise<void> {
    try {
      // Intentar invalidar el token en el servidor
      const token = getToken();
      if (token) {
        await apiClient.post('/logout', {});
        console.log('[AuthService] Sesión cerrada en el servidor');
      }
    } catch (error) {
      console.log('[AuthService] Error al cerrar sesión en servidor (continuando con logout local):', error);
    } finally {
      // Siempre limpiar el token local y datos de GitHub
      console.log('[AuthService] Eliminando token local y datos de sesión');
      clearToken();
      localStorage.removeItem(GITHUB_USER_KEY);
    }
  },

  // =============================================
  // MÉTODOS DE AUTENTICACIÓN CON GITHUB
  // =============================================

  /**
   * Obtiene la URL de autorización de GitHub e inicia el flujo OAuth
   */
  async loginWithGitHub(): Promise<void> {
    try {
      console.log('[AuthService] Iniciando autenticación con GitHub...');
      const response = await apiClient.get<GitHubAuthUrlResponse>('/github');
      
      if (response.authUrl) {
        console.log('[AuthService] Redirigiendo a GitHub para autorización');
        window.location.href = response.authUrl;
      } else {
        throw new Error('No se pudo obtener la URL de autorización de GitHub');
      }
    } catch (error) {
      console.error('[AuthService] Error al iniciar login con GitHub:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Error al conectar con GitHub');
      }
      throw new Error('Error al iniciar autenticación con GitHub');
    }
  },

  /**
   * Maneja el callback de GitHub OAuth
   */
  async handleGitHubCallback(code: string): Promise<GitHubAuthResponse> {
    try {
      console.log('[AuthService] Procesando callback de GitHub con código...');
      const response = await apiClient.post<GitHubAuthResponse>('/github/callback', { code });
      
      if (response.token) {
        console.log('[AuthService] Token de GitHub recibido, guardando...');
        setToken(response.token);
        
        // Guardar datos del usuario de GitHub
        if (response.user) {
          localStorage.setItem(GITHUB_USER_KEY, JSON.stringify(response.user));
          console.log('[AuthService] Datos de usuario GitHub guardados:', response.user.githubUsername);
        }
      }
      
      return response;
    } catch (error) {
      console.error('[AuthService] Error en callback de GitHub:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Error al procesar autenticación de GitHub');
      }
      throw new Error('Error al completar la autenticación con GitHub');
    }
  },

  /**
   * Obtiene los datos del usuario de GitHub almacenados localmente
   */
  getGitHubUser(): GitHubUser | null {
    try {
      const userData = localStorage.getItem(GITHUB_USER_KEY);
      if (userData) {
        return JSON.parse(userData) as GitHubUser;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Verifica si el usuario actual es de GitHub
   */
  isGitHubUser(): boolean {
    const user = this.getGitHubUser();
    return user?.provider === 'github';
  }
};

