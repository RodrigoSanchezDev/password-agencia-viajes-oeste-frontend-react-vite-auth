import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { TextInput, Button, Alert } from '../../../components/ui';
import { authService } from '../services/authService';
import { validateEmail, validateRequired } from '../../../utils/validation';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineKey
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const successMessage = location.state?.message;

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateRequired(email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!validateRequired(password)) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setApiError('');
    setIsGitHubLoading(true);
    
    try {
      await authService.loginWithGitHub();
      // La redirección a GitHub se maneja en el servicio
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Error al conectar con GitHub. Por favor intenta nuevamente.');
      }
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left side - Hero Image */}
      <div className="login-hero">
        <div className="login-hero__overlay" />
        <div className="login-hero__content">
          <div className="login-hero__logo">
            <HiOutlinePaperAirplane className="login-hero__logo-icon" />
            <span className="login-hero__logo-text">Viajes Oeste</span>
          </div>
          <h1 className="login-hero__title">
            Descubre el mundo con nosotros
          </h1>
          <p className="login-hero__subtitle">
            Más de 10,000 destinos te esperan. Vive experiencias únicas en los lugares más increíbles del planeta.
          </p>
          <div className="login-hero__stats">
            <div className="login-hero__stat">
              <span className="login-hero__stat-number">10K+</span>
              <span className="login-hero__stat-label">Destinos</span>
            </div>
            <div className="login-hero__stat">
              <span className="login-hero__stat-number">50K+</span>
              <span className="login-hero__stat-label">Viajeros</span>
            </div>
            <div className="login-hero__stat">
              <span className="login-hero__stat-number">4.9</span>
              <span className="login-hero__stat-label">Rating</span>
            </div>
          </div>
        </div>
        <div className="login-hero__decoration">
          <div className="login-hero__circle login-hero__circle--1" />
          <div className="login-hero__circle login-hero__circle--2" />
          <div className="login-hero__circle login-hero__circle--3" />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-form__header">
            <h2 className="login-form__title">Bienvenido de vuelta</h2>
            <p className="login-form__subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="login-form__credentials-box">
            <HiOutlineKey className="login-form__credentials-icon" />
            <div className="login-form__credentials-content">
              <p className="login-form__credentials-title">Servidor Local</p>
              <p className="login-form__credentials-text">
                <Link to="/register" className="login-form__link">Regístrate</Link> primero antes de iniciar sesión
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {successMessage && <Alert type="success" message={successMessage} />}
            {apiError && <Alert type="error" message={apiError} onClose={() => setApiError('')} />}

            <TextInput
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="tucorreo@ejemplo.com"
              required
              autoComplete="email"
            />

            <TextInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="login-form__options">
              <label className="login-form__remember">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="login-form__forgot">¿Olvidaste tu contraseña?</a>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Iniciar sesión
            </Button>

            <div className="login-form__divider">
              <span>o continúa con</span>
            </div>

            <div className="login-form__social">
              <button 
                type="button" 
                className="login-form__social-btn login-form__social-btn--github"
                onClick={handleGitHubLogin}
                disabled={isGitHubLoading || isLoading}
              >
                {isGitHubLoading ? (
                  <>
                    <div className="login-form__social-spinner"></div>
                    Conectando...
                  </>
                ) : (
                  <>
                    <FaGithub size={20} />
                    Continuar con GitHub
                  </>
                )}
              </button>
            </div>

            <div className="login-form__footer">
              <p>
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="login-form__link">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
