import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import './GitHubCallbackPage.css';

// Flag para evitar doble llamada en React.StrictMode
let isProcessingCallback = false;

export const GitHubCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      // Evitar doble procesamiento en React.StrictMode
      if (isProcessingCallback) {
        console.log('[GitHub Callback] Ya se está procesando el callback, ignorando...');
        return;
      }
      isProcessingCallback = true;

      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Si GitHub devolvió un error
      if (error) {
        console.error('[GitHub Callback] Error de GitHub:', error, errorDescription);
        setStatus('error');
        setErrorMessage(errorDescription || 'Error en la autorización de GitHub');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Error al autenticar con GitHub. Por favor intenta nuevamente.',
              type: 'error'
            }
          });
        }, 3000);
        return;
      }

      // Si no hay código, es un error
      if (!code) {
        console.error('[GitHub Callback] No se recibió código de autorización');
        setStatus('error');
        setErrorMessage('No se recibió el código de autorización');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      try {
        console.log('[GitHub Callback] Procesando código de autorización...');
        const response = await authService.handleGitHubCallback(code);
        
        setStatus('success');
        setUserName(response.user?.name || response.user?.githubUsername || 'Usuario');
        
        console.log('[GitHub Callback] Autenticación exitosa, redirigiendo al dashboard...');
        
        // Mostrar mensaje de éxito y redirigir
        setTimeout(() => {
          isProcessingCallback = false; // Reset flag antes de navegar
          navigate('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('[GitHub Callback] Error al procesar callback:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Error al autenticar con GitHub');
        isProcessingCallback = false; // Reset flag en caso de error
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Error al completar la autenticación con GitHub',
              type: 'error'
            }
          });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="github-callback">
      <div className="github-callback__container">
        {/* Logo */}
        <div className="github-callback__logo">
          <HiOutlinePaperAirplane className="github-callback__logo-icon" />
          <span className="github-callback__logo-text">Viajes Oeste</span>
        </div>

        {/* Status Card */}
        <div className="github-callback__card">
          {status === 'loading' && (
            <>
              <div className="github-callback__spinner-container">
                <FaGithub className="github-callback__github-icon github-callback__github-icon--loading" />
                <div className="github-callback__spinner"></div>
              </div>
              <h2 className="github-callback__title">Conectando con GitHub</h2>
              <p className="github-callback__message">
                Estamos verificando tu identidad y preparando tu cuenta...
              </p>
              <div className="github-callback__progress">
                <div className="github-callback__progress-bar"></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="github-callback__success-icon">
                <FaGithub className="github-callback__github-icon github-callback__github-icon--success" />
                <div className="github-callback__checkmark">✓</div>
              </div>
              <h2 className="github-callback__title github-callback__title--success">
                ¡Bienvenido, {userName}!
              </h2>
              <p className="github-callback__message">
                Tu cuenta de GitHub ha sido verificada exitosamente.
                <br />
                Redirigiendo al panel de control...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="github-callback__error-icon">
                <FaGithub className="github-callback__github-icon github-callback__github-icon--error" />
                <div className="github-callback__error-mark">✕</div>
              </div>
              <h2 className="github-callback__title github-callback__title--error">
                Error de autenticación
              </h2>
              <p className="github-callback__message github-callback__message--error">
                {errorMessage}
              </p>
              <p className="github-callback__redirect-message">
                Serás redirigido a la página de inicio de sesión...
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="github-callback__footer">
          Autenticación segura con GitHub OAuth 2.0
        </p>
      </div>

      {/* Background decoration */}
      <div className="github-callback__bg-decoration">
        <div className="github-callback__circle github-callback__circle--1"></div>
        <div className="github-callback__circle github-callback__circle--2"></div>
        <div className="github-callback__circle github-callback__circle--3"></div>
      </div>
    </div>
  );
};
