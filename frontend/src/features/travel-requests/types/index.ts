// Tipos para Solicitudes de Viaje

export type TripType = 'negocios' | 'turismo' | 'otros';
export type RequestStatus = 'pendiente' | 'en_proceso' | 'finalizada';

export interface TravelRequest {
  id: number;
  clientDni: string;
  clientName: string;
  clientEmail: string;
  origin: string;
  destination: string;
  tripType: TripType;
  departureDateTime: string;
  returnDateTime: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTravelRequestDTO {
  clientDni: string;
  clientName: string;
  clientEmail: string;
  origin: string;
  destination: string;
  tripType: TripType;
  departureDateTime: string;
  returnDateTime: string;
  status?: RequestStatus;
}

export interface UpdateTravelRequestDTO {
  clientDni?: string;
  clientName?: string;
  clientEmail?: string;
  origin?: string;
  destination?: string;
  tripType?: TripType;
  departureDateTime?: string;
  returnDateTime?: string;
  status?: RequestStatus;
}

export interface TravelRequestsResponse {
  message: string;
  count: number;
  data: TravelRequest[];
}

export interface TravelRequestResponse {
  message: string;
  data: TravelRequest;
}

export interface TravelRequestStats {
  total: number;
  pendientes: number;
  enProceso: number;
  finalizadas: number;
  porTipo: {
    negocios: number;
    turismo: number;
    otros: number;
  };
}

export interface TravelRequestStatsResponse {
  message: string;
  data: TravelRequestStats;
}

export interface SSRListResponse {
  message: string;
  html: string;
  data: TravelRequest[];
  stats: TravelRequestStats;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  errors?: ValidationError[];
}

// Opciones para los selectores
export const TRIP_TYPE_OPTIONS = [
  { value: 'negocios', label: 'Negocios' },
  { value: 'turismo', label: 'Turismo' },
  { value: 'otros', label: 'Otros' }
] as const;

export const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'finalizada', label: 'Finalizada' }
] as const;

// Lista de clientes de ejemplo para búsqueda
export const SAMPLE_CLIENTS = [
  { dni: '16414595-0', name: 'Esteban Castro Paredes', email: 'esteban.castro@email.com' },
  { dni: '18765432-1', name: 'Fabián Gamboa Martínez', email: 'fabian.gamboa@email.com' },
  { dni: '19876543-2', name: 'Yasna Plaza Morales', email: 'yasna.plaza@email.com' },
  { dni: '20987654-3', name: 'Fernanda Quintana Rivera', email: 'fernanda.quintana@email.com' },
  { dni: '17654321-K', name: 'Carlos Mendoza Salinas', email: 'carlos.mendoza@email.com' },
  { dni: '15543210-9', name: 'María González Pérez', email: 'maria.gonzalez@email.com' },
  { dni: '21098765-4', name: 'Roberto Silva Contreras', email: 'roberto.silva@email.com' },
  { dni: '16209876-5', name: 'Patricia Vega Fuentes', email: 'patricia.vega@email.com' }
] as const;

// Lista de ciudades de ejemplo
export const SAMPLE_CITIES = [
  'Santiago, Chile',
  'Buenos Aires, Argentina',
  'Lima, Perú',
  'Bogotá, Colombia',
  'Ciudad de México, México',
  'Madrid, España',
  'Barcelona, España',
  'París, Francia',
  'Roma, Italia',
  'Londres, Reino Unido',
  'Nueva York, Estados Unidos',
  'Miami, Estados Unidos',
  'Los Ángeles, Estados Unidos',
  'Tokio, Japón',
  'Sídney, Australia',
  'Cancún, México',
  'Río de Janeiro, Brasil',
  'Cartagena, Colombia',
  'La Habana, Cuba',
  'Punta Cana, República Dominicana'
] as const;
