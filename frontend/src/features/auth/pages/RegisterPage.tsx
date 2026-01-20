import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, Button, Alert } from '../../../components/ui';
import { authService } from '../services/authService';
import { validateEmail, validateRequired } from '../../../utils/validation';
import { 
  HiOutlineLightBulb,
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiStar
} from 'react-icons/hi';
import './RegisterPage.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateRequired(email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!validateRequired(password)) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
      await authService.register({ email, password });
      navigate('/login', { 
        state: { message: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.' } 
      });
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Error al procesar el registro. Por favor intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left side - Form */}
      <div className="register-form-container">
        <div className="register-form-wrapper">
          <Link to="/login" className="register-back">
            <HiOutlineArrowLeft /> Volver al login
          </Link>
          
          <div className="register-form__header">
            <h2 className="register-form__title">Crea tu cuenta</h2>
            <p className="register-form__subtitle">Únete a miles de viajeros que confían en nosotros</p>
          </div>

          <div className="register-form__credentials-box">
            <HiOutlineLightBulb className="register-form__credentials-icon" />
            <div className="register-form__credentials-content">
              <p className="register-form__credentials-title">Servidor Local</p>
              <p className="register-form__credentials-text">Usa cualquier email válido y contraseña de 6+ caracteres</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form" noValidate>
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
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />

            <div className="register-form__terms">
              <label className="register-form__terms-label">
                <input type="checkbox" required />
                <span>Acepto los <a href="#">Términos de Servicio</a> y la <a href="#">Política de Privacidad</a></span>
              </label>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Crear cuenta
            </Button>

            <div className="register-form__footer">
              <p>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="register-form__link">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="register-hero">
        <div className="register-hero__overlay" />
        <div className="register-hero__content">
          <div className="register-hero__testimonial">
            <div className="register-hero__stars">
              <HiStar /><HiStar /><HiStar /><HiStar /><HiStar />
            </div>
            <p className="register-hero__quote">
              "La mejor experiencia de viaje que he tenido. El equipo de Viajes Oeste hizo que todo fuera perfecto."
            </p>
            <div className="register-hero__author">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=maria" alt="Avatar" className="register-hero__avatar" />
              <div>
                <p className="register-hero__name">María González</p>
                <p className="register-hero__role">Viajera frecuente</p>
              </div>
            </div>
          </div>
          
          <div className="register-hero__features">
            <div className="register-hero__feature">
              <HiOutlineCheck className="register-hero__feature-icon" />
              <span>Acceso a ofertas exclusivas</span>
            </div>
            <div className="register-hero__feature">
              <HiOutlineCheck className="register-hero__feature-icon" />
              <span>Acumula millas con cada viaje</span>
            </div>
            <div className="register-hero__feature">
              <HiOutlineCheck className="register-hero__feature-icon" />
              <span>Soporte 24/7 en tu idioma</span>
            </div>
          </div>
        </div>
        <div className="register-hero__decoration">
          <div className="register-hero__circle register-hero__circle--1" />
          <div className="register-hero__circle register-hero__circle--2" />
        </div>
      </div>
    </div>
  );
};
