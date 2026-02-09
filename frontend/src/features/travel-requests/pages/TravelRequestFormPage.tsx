import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, Button, Alert, Select, RadioGroup, SearchSelect } from '../../../components/ui';
import { travelRequestService } from '../services/travelRequestService';
import { authService } from '../../auth/services/authService';
import { apiClient } from '../../../api/client';
import { 
  validateEmail, 
  validateRequired, 
  validateDni, 
  validateDateTime,
  validateReturnAfterDeparture,
  validateTripType,
  validateStatus
} from '../../../utils/validation';
import { 
  TRIP_TYPE_OPTIONS, 
  STATUS_OPTIONS, 
  SAMPLE_CLIENTS, 
  SAMPLE_CITIES 
} from '../types';
import type { CreateTravelRequestDTO, TripType, RequestStatus } from '../types';
import { 
  HiOutlinePaperAirplane,
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineTicket,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import '../../auth/pages/DashboardPage.css';
import './TravelRequestFormPage.css';

// Tipo para la respuesta del usuario
interface UserResponse {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  githubUsername?: string;
  provider?: 'github' | 'local';
  createdAt: string;
}

interface FormErrors {
  clientDni?: string;
  clientName?: string;
  clientEmail?: string;
  origin?: string;
  destination?: string;
  tripType?: string;
  departureDateTime?: string;
  returnDateTime?: string;
  status?: string;
}

export const TravelRequestFormPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado del usuario
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [isGitHubUser, setIsGitHubUser] = useState<boolean>(false);
  
  // Estado del formulario
  const [clientDni, setClientDni] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState<TripType | ''>('');
  const [departureDateTime, setDepartureDateTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [status, setStatus] = useState<RequestStatus>('pendiente');
  
  // Estado de UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener información del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const githubUser = authService.getGitHubUser();
        
        if (githubUser) {
          setUserAvatar(githubUser.avatarUrl || '');
          setGithubUsername(githubUser.githubUsername || '');
          setIsGitHubUser(true);
        } else {
          const user = await apiClient.get<UserResponse>('/me');
          setUserAvatar(user.avatarUrl || '');
          setGithubUsername(user.githubUsername || '');
          setIsGitHubUser(user.provider === 'github');
        }
      } catch (error) {
        console.log('Error al obtener usuario:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  // Opciones para los selectores de búsqueda
  const clientOptions = SAMPLE_CLIENTS.map(client => ({
    value: client.dni,
    label: client.name,
    subLabel: client.dni
  }));

  const cityOptions = SAMPLE_CITIES.map(city => ({
    value: city,
    label: city
  }));

  // Manejar selección de cliente
  const handleClientSelect = (dni: string) => {
    setClientDni(dni);
    const client = SAMPLE_CLIENTS.find(c => c.dni === dni);
    if (client) {
      setClientName(client.name);
      setClientEmail(client.email);
    } else {
      setClientName('');
      setClientEmail('');
    }
  };

  // Validación del formulario
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar DNI
    if (!validateRequired(clientDni)) {
      newErrors.clientDni = 'El DNI del cliente es requerido';
    } else if (!validateDni(clientDni)) {
      newErrors.clientDni = 'El formato del DNI no es válido (ej: 12345678-9)';
    }

    // Validar nombre
    if (!validateRequired(clientName)) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }

    // Validar email
    if (!validateRequired(clientEmail)) {
      newErrors.clientEmail = 'El email del cliente es requerido';
    } else if (!validateEmail(clientEmail)) {
      newErrors.clientEmail = 'El formato del email no es válido';
    }

    // Validar origen
    if (!validateRequired(origin)) {
      newErrors.origin = 'El origen es requerido';
    }

    // Validar destino
    if (!validateRequired(destination)) {
      newErrors.destination = 'El destino es requerido';
    }

    // Validar tipo de viaje
    if (!tripType || !validateTripType(tripType)) {
      newErrors.tripType = 'Selecciona un tipo de viaje';
    }

    // Validar fecha de salida
    if (!validateRequired(departureDateTime)) {
      newErrors.departureDateTime = 'La fecha y hora de salida es requerida';
    } else if (!validateDateTime(departureDateTime)) {
      newErrors.departureDateTime = 'El formato de fecha y hora no es válido';
    }

    // Validar fecha de regreso
    if (!validateRequired(returnDateTime)) {
      newErrors.returnDateTime = 'La fecha y hora de regreso es requerida';
    } else if (!validateDateTime(returnDateTime)) {
      newErrors.returnDateTime = 'El formato de fecha y hora no es válido';
    } else if (departureDateTime && !validateReturnAfterDeparture(departureDateTime, returnDateTime)) {
      newErrors.returnDateTime = 'La fecha de regreso debe ser posterior a la de salida';
    }

    // Validar estado
    if (!validateStatus(status)) {
      newErrors.status = 'Selecciona un estado válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const requestData: CreateTravelRequestDTO = {
        clientDni,
        clientName,
        clientEmail,
        origin,
        destination,
        tripType: tripType as TripType,
        departureDateTime,
        returnDateTime,
        status
      };

      const newRequest = await travelRequestService.create(requestData);
      
      setSuccessMessage(`Solicitud #${newRequest.id} registrada exitosamente`);
      
      // Limpiar formulario
      setClientDni('');
      setClientName('');
      setClientEmail('');
      setOrigin('');
      setDestination('');
      setTripType('');
      setDepartureDateTime('');
      setReturnDateTime('');
      setStatus('pendiente');
      setErrors({});

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        navigate('/travel-requests');
      }, 2000);
      
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Error al registrar la solicitud. Por favor intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar - Mismo que Dashboard */}
      <aside className="dashboard__sidebar">
        <div className="dashboard__logo">
          <HiOutlinePaperAirplane className="dashboard__logo-icon" />
          <span className="dashboard__logo-text">Viajes Oeste</span>
        </div>
        
        <nav className="dashboard__nav">
          <Link to="/dashboard" className="dashboard__nav-item">
            <HiOutlineHome className="dashboard__nav-icon" />
            <span>Inicio</span>
          </Link>
          <Link to="/travel-requests" className="dashboard__nav-item dashboard__nav-item--active">
            <HiOutlineDocumentText className="dashboard__nav-icon" />
            <span>Solicitudes de Viaje</span>
          </Link>
          <a href="#" className="dashboard__nav-item">
            <HiOutlineSearch className="dashboard__nav-icon" />
            <span>Explorar</span>
          </a>
          <a href="#" className="dashboard__nav-item">
            <HiOutlineHeart className="dashboard__nav-icon" />
            <span>Favoritos</span>
          </a>
          <a href="#" className="dashboard__nav-item">
            <HiOutlineTicket className="dashboard__nav-icon" />
            <span>Mis Viajes</span>
          </a>
          <a href="#" className="dashboard__nav-item">
            <HiOutlineCreditCard className="dashboard__nav-icon" />
            <span>Pagos</span>
          </a>
          <a href="#" className="dashboard__nav-item">
            <HiOutlineCog className="dashboard__nav-icon" />
            <span>Configuración</span>
          </a>
        </nav>

        <div className="dashboard__sidebar-footer">
          <button onClick={handleLogout} className="dashboard__logout-btn">
            <HiOutlineLogout />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Header */}
        <header className="dashboard__header">
          <div className="dashboard__header-content">
            <div>
              <h1 className="dashboard__greeting">Nueva Solicitud</h1>
              <p className="dashboard__greeting-sub">
                {isGitHubUser ? (
                  <span className="dashboard__github-badge">
                    <FaGithub className="dashboard__github-icon" />
                    Conectado como @{githubUsername}
                  </span>
                ) : (
                  'Complete el formulario para registrar una nueva solicitud'
                )}
              </p>
            </div>
            <div className="dashboard__header-actions">
              <button className="dashboard__notification">
                <HiOutlineBell />
                <span className="dashboard__notification-badge">3</span>
              </button>
              <div className="dashboard__avatar">
                {userAvatar ? (
                  <img src={userAvatar} alt="Avatar" />
                ) : (
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=traveler" alt="Avatar" />
                )}
                {isGitHubUser && (
                  <div className="dashboard__avatar-badge">
                    <FaGithub />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="travel-request-form-container">
          {/* Botón Volver */}
          <button 
            onClick={() => navigate('/travel-requests')} 
            className="travel-request-form__back-btn"
          >
            <HiOutlineArrowLeft />
            <span>Volver a la lista</span>
          </button>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="travel-request-form" noValidate>
            {successMessage && (
              <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
            )}
            {apiError && (
              <Alert type="error" message={apiError} onClose={() => setApiError('')} />
            )}

            {/* Sección: Datos del Cliente */}
            <div className="travel-request-form__section">
              <h2 className="travel-request-form__section-title">
                <HiOutlineUser />
                Datos del Cliente
              </h2>
              
              <div className="travel-request-form__grid">
                <SearchSelect
                  label="Buscar Cliente"
                  options={clientOptions}
                  value={clientDni}
                  onChange={handleClientSelect}
                  placeholder="Buscar por nombre o DNI..."
                  error={errors.clientDni}
                  helperText="Selecciona un cliente de la lista o ingresa manualmente"
                />

                <TextInput
                  label="DNI del Cliente"
                  type="text"
                  value={clientDni}
                  onChange={(e) => setClientDni(e.target.value)}
                  error={errors.clientDni}
                  placeholder="Ej: 16414595-0"
                />

                <TextInput
                  label="Nombre del Cliente"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  error={errors.clientName}
                  placeholder="Nombre completo"
                />

                <TextInput
                  label="Email del Cliente"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  error={errors.clientEmail}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Sección: Detalles del Viaje */}
            <div className="travel-request-form__section">
              <h2 className="travel-request-form__section-title">
                <HiOutlineLocationMarker />
                Detalles del Viaje
              </h2>
              
              <div className="travel-request-form__grid">
                <SearchSelect
                  label="Origen"
                  options={cityOptions}
                  value={origin}
                  onChange={(value) => setOrigin(value)}
                  placeholder="Buscar ciudad de origen..."
                  error={errors.origin}
                />

                <SearchSelect
                  label="Destino"
                  options={cityOptions}
                  value={destination}
                  onChange={(value) => setDestination(value)}
                  placeholder="Buscar ciudad de destino..."
                  error={errors.destination}
                />

                <Select
                  label="Tipo de Viaje"
                  options={TRIP_TYPE_OPTIONS}
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as TripType)}
                  error={errors.tripType}
                  placeholder="Selecciona el tipo de viaje"
                />
              </div>
            </div>

            {/* Sección: Fechas */}
            <div className="travel-request-form__section">
              <h2 className="travel-request-form__section-title">
                <HiOutlineCalendar />
                Fechas del Viaje
              </h2>
              
              <div className="travel-request-form__grid">
                <TextInput
                  label="Fecha y Hora de Salida"
                  type="datetime-local"
                  value={departureDateTime}
                  onChange={(e) => setDepartureDateTime(e.target.value)}
                  error={errors.departureDateTime}
                />

                <TextInput
                  label="Fecha y Hora de Regreso"
                  type="datetime-local"
                  value={returnDateTime}
                  onChange={(e) => setReturnDateTime(e.target.value)}
                  error={errors.returnDateTime}
                />
              </div>
            </div>

            {/* Sección: Estado */}
            <div className="travel-request-form__section">
              <RadioGroup
                label="Estado de la Solicitud"
                name="status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(value) => setStatus(value as RequestStatus)}
                error={errors.status}
              />
            </div>

            {/* Botones de acción */}
            <div className="travel-request-form__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/travel-requests')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Registrar Solicitud
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
