/**
 * Servicio de Solicitudes de Viaje
 * Maneja la comunicación con el backend para solicitudes de viaje
 */

import type { 
  TravelRequest, 
  CreateTravelRequestDTO, 
  UpdateTravelRequestDTO,
  TravelRequestsResponse,
  TravelRequestResponse,
  TravelRequestStatsResponse,
  SSRListResponse,
  RequestStatus
} from '../types';
import { getToken } from '../../../utils/storage';

const API_BASE_URL = 'http://localhost:3001/api/travel-requests';

/**
 * Headers comunes para las peticiones
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Manejo de errores de la API
 */
const handleApiError = async (response: Response): Promise<never> => {
  const errorData = await response.json().catch(() => ({}));
  const message = errorData.message || 'Error en la petición';
  throw new Error(message);
};

export const travelRequestService = {
  /**
   * Obtiene todas las solicitudes de viaje
   */
  async getAll(): Promise<TravelRequest[]> {
    console.log('[TravelRequestService] Obteniendo todas las solicitudes...');
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestsResponse = await response.json();
    console.log(`[TravelRequestService] ${data.count} solicitudes obtenidas`);
    return data.data;
  },

  /**
   * Obtiene una solicitud por ID
   */
  async getById(id: number): Promise<TravelRequest> {
    console.log(`[TravelRequestService] Obteniendo solicitud #${id}...`);
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestResponse = await response.json();
    return data.data;
  },

  /**
   * Crea una nueva solicitud de viaje
   */
  async create(requestData: CreateTravelRequestDTO): Promise<TravelRequest> {
    console.log('[TravelRequestService] Creando nueva solicitud...', requestData);
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestResponse = await response.json();
    console.log(`[TravelRequestService] Solicitud creada: #${data.data.id}`);
    return data.data;
  },

  /**
   * Actualiza una solicitud de viaje
   */
  async update(id: number, requestData: UpdateTravelRequestDTO): Promise<TravelRequest> {
    console.log(`[TravelRequestService] Actualizando solicitud #${id}...`, requestData);
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestResponse = await response.json();
    console.log(`[TravelRequestService] Solicitud actualizada: #${id}`);
    return data.data;
  },

  /**
   * Actualiza el estado de una solicitud
   */
  async updateStatus(id: number, status: RequestStatus): Promise<TravelRequest> {
    console.log(`[TravelRequestService] Actualizando estado de #${id} a ${status}...`);
    
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestResponse = await response.json();
    console.log(`[TravelRequestService] Estado actualizado: #${id} -> ${status}`);
    return data.data;
  },

  /**
   * Elimina una solicitud de viaje
   */
  async delete(id: number): Promise<void> {
    console.log(`[TravelRequestService] Eliminando solicitud #${id}...`);
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    console.log(`[TravelRequestService] Solicitud eliminada: #${id}`);
  },

  /**
   * Obtiene estadísticas de solicitudes
   */
  async getStats(): Promise<TravelRequestStatsResponse['data']> {
    console.log('[TravelRequestService] Obteniendo estadísticas...');
    
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestStatsResponse = await response.json();
    console.log('[TravelRequestService] Estadísticas obtenidas');
    return data.data;
  },

  /**
   * Busca solicitudes por DNI del cliente
   */
  async searchByDni(dni: string): Promise<TravelRequest[]> {
    console.log(`[TravelRequestService] Buscando solicitudes del cliente ${dni}...`);
    
    const response = await fetch(`${API_BASE_URL}/search/dni/${encodeURIComponent(dni)}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: TravelRequestsResponse = await response.json();
    console.log(`[TravelRequestService] ${data.count} solicitudes encontradas`);
    return data.data;
  },

  /**
   * Obtiene el HTML renderizado desde el servidor (SSR)
   */
  async getSSRList(): Promise<SSRListResponse> {
    console.log('[TravelRequestService] Obteniendo contenido SSR...');
    
    const response = await fetch(`${API_BASE_URL}/ssr/list`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: SSRListResponse = await response.json();
    console.log('[TravelRequestService] Contenido SSR recibido');
    return data;
  }
};
