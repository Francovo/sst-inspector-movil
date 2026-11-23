import { IonPage, IonContent, IonIcon, IonRouterLink, useIonRouter, useIonToast } from '@ionic/react';
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  personAddOutline,
  wifiOutline,
  clipboardOutline,
  cameraOutline,
  cloudDoneOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { useState } from 'react';

import './Login.css';
import { loginUser } from '../../services/auth.service';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      presentToast({
        message: 'Ingresa tu correo y contraseña.',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      return;
    }

    const result = loginUser(email, password, rememberSession);

    if (!result.success) {
      presentToast({
        message: result.message,
        duration: 2500,
        color: 'danger',
        position: 'top',
      });
      return;
    }

    presentToast({
      message: result.message,
      duration: 1500,
      color: 'success',
      position: 'top',
    });

    router.push('/dashboard', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <main className="login-container">
          {/* Encabezado */}
          <header className="login-header">
            <div className="login-brand">
              <div className="login-logo">
                <IonIcon icon={shieldCheckmarkOutline} />
              </div>

              <div className="login-brand-text">
                <h1>SST-Inspector Móvil</h1>
                <p>Inspecciones más seguras,</p>
                <p>empresas más saludables</p>
              </div>
            </div>

            <div className="login-header-decoration">
              <span>SEGURIDAD</span>
              <span>SALUD</span>
              <span>BIENESTAR</span>
              <span>SIEMPRE CONTIGO</span>
            </div>
          </header>

          {/* Formulario */}
          <section className="login-card">
            <div className="login-introduction">
              <h2>Inicia sesión</h2>
              <p>Accede con tu cuenta institucional para continuar con tus inspecciones de SST.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Correo */}
              <div className="login-field">
                <IonIcon icon={mailOutline} />

                <div className="login-input-wrapper">
                  <label htmlFor="login-email">Correo institucional</label>

                  <input
                    id="login-email"
                    type="email"
                    placeholder="ejemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="login-field">
                <IonIcon icon={lockClosedOutline} />

                <div className="login-input-wrapper">
                  <label htmlFor="login-password">Contraseña</label>

                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>

              {/* Recordar sesión */}
              <div className="login-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                  />
                  <span>Recordar mi sesión</span>
                </label>

                <button type="button" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Ingresar */}
              <button type="submit" className="login-button">
                <span>Ingresar</span>
                <IonIcon icon={arrowForwardOutline} />
              </button>
            </form>

            {/* Separador */}
            <div className="login-divider">
              <span>¿No tienes una cuenta?</span>
            </div>

            {/* Crear cuenta */}
            <IonRouterLink routerLink="/register" className="register-button">
              <IonIcon icon={personAddOutline} />
              <span>Crear cuenta</span>
            </IonRouterLink>

            {/* Modo sin conexión */}
            <div className="offline-card">
              <div className="offline-icon">
                <IonIcon icon={wifiOutline} />
              </div>

              <div>
                <h3>Modo sin conexión</h3>
                <p>
                  Puedes realizar inspecciones, guardar tus datos y evidencias, incluso sin internet. Se sincronizarán
                  automáticamente cuando tengas conexión.
                </p>
              </div>
            </div>
          </section>

          {/* Navegación inferior */}
          <footer className="login-footer">
            <div className="footer-item">
              <IonIcon icon={clipboardOutline} />
              <span>Inspecciona</span>
            </div>

            <div className="footer-item">
              <IonIcon icon={cameraOutline} />
              <span>Registra evidencias</span>
            </div>

            <div className="footer-item">
              <IonIcon icon={cloudDoneOutline} />
              <span>Sincroniza</span>
              <small>cuando tengas conexión</small>
            </div>
          </footer>

          <span className="login-version">v1.0.0</span>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Login;
