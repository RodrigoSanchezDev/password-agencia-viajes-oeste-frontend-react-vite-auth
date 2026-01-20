import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiClient } from '../../../api/client';
import { 
  HiOutlinePaperAirplane,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineTicket,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineArrowRight
} from 'react-icons/hi';
import { FiTarget } from 'react-icons/fi';
import './DashboardPage.css';

// Tipo para la respuesta del usuario
interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

const destinations = [
  { id: 1, name: 'Santorini', country: 'Grecia', price: 1299, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80', rating: 4.9 },
  { id: 2, name: 'Bali', country: 'Indonesia', price: 899, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', rating: 4.8 },
  { id: 3, name: 'Maldivas', country: 'Maldivas', price: 2199, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80', rating: 5.0 },
  { id: 4, name: 'Tokio', country: 'Japón', price: 1599, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', rating: 4.7 },
];

const stats = [
  { label: 'Viajes Realizados', value: '24', icon: 'plane', change: '+12%' },
  { label: 'Países Visitados', value: '18', icon: 'globe', change: '+3' },
  { label: 'Millas Acumuladas', value: '45.2K', icon: 'target', change: '+8.5K' },
  { label: 'Próximo Viaje', value: '15 días', icon: 'calendar', change: 'Bali' },
];

const getStatIcon = (iconName: string) => {
  switch (iconName) {
    case 'plane': return <HiOutlinePaperAirplane />;
    case 'globe': return <HiOutlineGlobeAlt />;
    case 'target': return <FiTarget />;
    case 'calendar': return <HiOutlineCalendar />;
    default: return <HiOutlineStar />;
  }
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');

  // Obtener información del usuario al cargar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiClient.get<UserResponse>('/me');
        setUserEmail(user.email);
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

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <div className="dashboard__logo">
          <HiOutlinePaperAirplane className="dashboard__logo-icon" />
          <span className="dashboard__logo-text">Viajes Oeste</span>
        </div>
        
        <nav className="dashboard__nav">
          <a href="#" className="dashboard__nav-item dashboard__nav-item--active">
            <HiOutlineHome className="dashboard__nav-icon" />
            <span>Inicio</span>
          </a>
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
              <h1 className="dashboard__greeting">¡Bienvenido/a!</h1>
              <p className="dashboard__greeting-sub">
                {userEmail ? `Sesión iniciada como: ${userEmail}` : '¿Listo para tu próxima aventura?'}
              </p>
            </div>
            <div className="dashboard__header-actions">
              <div className="dashboard__search">
                <HiOutlineSearch className="dashboard__search-icon" />
                <input type="text" placeholder="Buscar destinos..." className="dashboard__search-input" />
              </div>
              <button className="dashboard__notification">
                <HiOutlineBell />
                <span className="dashboard__notification-badge">3</span>
              </button>
              <div className="dashboard__avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=traveler" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="dashboard__stats">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard__stat-card">
              <div className="dashboard__stat-icon">{getStatIcon(stat.icon)}</div>
              <div className="dashboard__stat-content">
                <p className="dashboard__stat-label">{stat.label}</p>
                <p className="dashboard__stat-value">{stat.value}</p>
                <span className="dashboard__stat-change">{stat.change}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Featured Banner */}
        <section className="dashboard__banner">
          <div className="dashboard__banner-content">
            <span className="dashboard__banner-tag">Oferta Especial</span>
            <h2 className="dashboard__banner-title">Descubre las Maldivas</h2>
            <p className="dashboard__banner-text">
              Escapa al paraíso con hasta 40% de descuento en resorts de lujo. 
              Oferta válida hasta fin de mes.
            </p>
            <button className="dashboard__banner-btn">
              Reservar Ahora
              <HiOutlineArrowRight />
            </button>
          </div>
          <div className="dashboard__banner-image">
            <img src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80" alt="Maldivas" />
          </div>
        </section>

        {/* Destinations */}
        <section className="dashboard__destinations">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Destinos Populares</h2>
            <a href="#" className="dashboard__section-link">Ver todos →</a>
          </div>
          <div className="dashboard__destinations-grid">
            {destinations.map((dest) => (
              <div key={dest.id} className="dashboard__destination-card">
                <div className="dashboard__destination-image">
                  <img src={dest.image} alt={dest.name} />
                  <button className="dashboard__destination-fav">
                    <HiOutlineHeart />
                  </button>
                  <div className="dashboard__destination-rating">
                    <HiOutlineStar /> {dest.rating}
                  </div>
                </div>
                <div className="dashboard__destination-content">
                  <h3 className="dashboard__destination-name">{dest.name}</h3>
                  <p className="dashboard__destination-country">{dest.country}</p>
                  <div className="dashboard__destination-footer">
                    <span className="dashboard__destination-price">
                      <span className="dashboard__destination-price-label">desde</span>
                      ${dest.price}
                    </span>
                    <button className="dashboard__destination-btn">Reservar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
