import { apiClient } from '../../../api/client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { setToken, clearToken, getToken } from '../../../utils/storage';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/login', credentials);
      console.log('[AuthService] Guardando token en localStorage:', response.token);
      setToken(response.token);
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
      // Siempre limpiar el token local
      console.log('[AuthService] Eliminando token local');
      clearToken();
    }
  },
};
