import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Alert } from '../../../components/ui';
import { travelRequestService } from '../services/travelRequestService';
import { authService } from '../../auth/services/authService';
import { apiClient } from '../../../api/client';
import { 
  HiOutlinePaperAirplane,
  HiOutlinePlus,
  HiOutlineRefresh,
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
import './TravelRequestListPage.css';

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

export const TravelRequestListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado del usuario
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [isGitHubUser, setIsGitHubUser] = useState<boolean>(false);
  
  // Estado de solicitudes (Solo SSR como requiere el profesor)
  const [ssrHtml, setSsrHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Cargar datos desde el servidor (SSR)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Obtener contenido HTML renderizado desde el servidor (SSR)
      const ssrResponse = await travelRequestService.getSSRList();
      setSsrHtml(ssrResponse.html);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al cargar las solicitudes');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
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
              <h1 className="dashboard__greeting">Solicitudes de Viaje</h1>
              <p className="dashboard__greeting-sub">
                {isGitHubUser ? (
                  <span className="dashboard__github-badge">
                    <FaGithub className="dashboard__github-icon" />
                    Conectado como @{githubUsername}
                  </span>
                ) : (
                  'Gestiona las solicitudes de viaje de los clientes'
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
        <div className="travel-requests">
          {/* Toolbar */}
          <div className="travel-requests__toolbar">
            <h2 className="travel-requests__title">Solicitudes de Viaje</h2>
            <div className="travel-requests__actions">
              <button 
                className="travel-requests__refresh-btn"
                onClick={loadData}
                disabled={isLoading}
              >
                <HiOutlineRefresh className={isLoading ? 'spinning' : ''} />
                Actualizar
              </button>
              <Button variant="primary" onClick={() => navigate('/travel-requests/new')}>
                <HiOutlinePlus />
                Nueva Solicitud
              </Button>
            </div>
          </div>

          {/* Mensajes de error */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Content Card - Solo SSR */}
          <div className="travel-requests__card">
            {isLoading ? (
              <div className="travel-requests__loading">
                <div className="loading-spinner" />
                <p>Cargando solicitudes desde el servidor...</p>
              </div>
            ) : (
              <div 
                className="ssr-content-container"
                dangerouslySetInnerHTML={{ __html: ssrHtml }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
