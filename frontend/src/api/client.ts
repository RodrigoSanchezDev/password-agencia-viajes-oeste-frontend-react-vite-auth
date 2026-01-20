/**
 * HTTP Client configuration
 * Conecta con el servidor backend local de Node.js + Express
 */

// URL base del backend local
const API_BASE_URL = 'http://localhost:3001/api';

// Función auxiliar para obtener el token del localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Interfaz para errores de la API
interface ApiError {
  error: string;
  message: string;
}

export const apiClient = {
  /**
   * Realiza una petición POST al backend
   */
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    console.log(`[API Client] POST ${endpoint}`, body);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Añadir token de autorización si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        console.log(`[API Client] Error ${response.status}:`, errorData.message);
        throw new Error(errorData.message || 'Error en la petición');
      }

      console.log(`[API Client] Respuesta exitosa:`, data);
      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[API Client] Error de conexión: El servidor backend no está disponible');
        throw new Error('No se puede conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3001');
      }
      throw error;
    }
  },

  /**
   * Realiza una petición GET al backend
   */
  async get<T>(endpoint: string): Promise<T> {
    console.log(`[API Client] GET ${endpoint}`);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.message || 'Error en la petición');
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se puede conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3001');
      }
      throw error;
    }
  },
};
