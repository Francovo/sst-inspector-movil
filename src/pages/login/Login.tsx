import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  arrowForwardOutline,
  cameraOutline,
  clipboardOutline,
  cloudOfflineOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  syncOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BrandMark from '../../components/BrandMark';
import './Login.css';

/**
 * Visual mockup of the "Iniciar Sesión" screen.
 * The form does not authenticate: submitting it only moves to the dashboard.
 */
const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <IonPage>
      <IonContent className="sst-screen">
        <div className="login">
          <header className="login__hero">
            <svg aria-hidden="true" className="login__skyline" preserveAspectRatio="none" viewBox="0 0 400 120">
              <path
                d="M0 120V70h25v15h25V55h30v65h30V40h5V10l5-5 5 5v30h25v80h60V65h30v55h40V50h40v30h30V60h30v60Z"
                fill="currentColor"
              />
              <path d="M120 5h70l10 10-5 3h-65" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <span className="login__seal">
              Seguridad
              <br />
              Salud
              <br />
              Bienestar
              <small>Siempre contigo</small>
            </span>

            <span className="login__logo">
              <BrandMark />
            </span>
            <h1 className="login__title">SST-Inspector Móvil</h1>
            <p className="login__tagline">Inspecciones más seguras, empresas más saludables</p>
          </header>

          <main className="login__body">
            <section className="sst-card login__card">
              <div className="login__heading">
                <h2>Inicia sesión</h2>
                <p>Accede con tu cuenta institucional para continuar con tus inspecciones de SST.</p>
              </div>

              <form
                className="login__form"
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate('/inicio');
                }}
              >
                <div className="sst-field">
                  <label className="sst-field__label" htmlFor="login-email">
                    Correo institucional
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={mailOutline} />
                    </span>
                    <input
                      autoComplete="email"
                      className="sst-input"
                      id="login-email"
                      placeholder="ejemplo@empresa.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="sst-field login__field--password">
                  <label className="sst-field__label" htmlFor="login-password">
                    Contraseña
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={lockClosedOutline} />
                    </span>
                    <input
                      autoComplete="current-password"
                      className="sst-input"
                      id="login-password"
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="login__eye"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                    </button>
                  </div>
                </div>

                <div className="login__row">
                  <label className="login__check" htmlFor="login-remember">
                    <input id="login-remember" type="checkbox" />
                    Recordar mi sesión
                  </label>
                  <button className="login__link" type="button">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button className="sst-button sst-button--primary sst-button--block" type="submit">
                  Ingresar
                  <IonIcon aria-hidden="true" icon={arrowForwardOutline} />
                </button>

                <div className="login__signup">
                  <p>¿No tienes una cuenta?</p>
                  <button
                    className="sst-button sst-button--outline sst-button--block"
                    onClick={() => navigate('/registro')}
                    type="button"
                  >
                    <IonIcon aria-hidden="true" icon={personAddOutline} />
                    Crear cuenta
                  </button>
                </div>
              </form>
            </section>

            <section className="sst-note sst-note--success">
              <IonIcon aria-hidden="true" icon={cloudOfflineOutline} />
              <div>
                <h3>Modo sin conexión</h3>
                <p>
                  Puedes realizar inspecciones, guardar tus datos y evidencias, incluso sin internet. Se sincronizarán
                  automáticamente cuando tengas conexión.
                </p>
              </div>
            </section>

            <div aria-label="Funciones de la aplicación" className="login__features">
              <div className="login__feature">
                <span className="login__feature-icon">
                  <IonIcon aria-hidden="true" icon={clipboardOutline} />
                </span>
                <span>Inspecciona</span>
              </div>
              <div className="login__feature">
                <span className="login__feature-icon">
                  <IonIcon aria-hidden="true" icon={cameraOutline} />
                </span>
                <span>Registra evidencias</span>
              </div>
              <div className="login__feature">
                <span className="login__feature-icon">
                  <IonIcon aria-hidden="true" icon={syncOutline} />
                </span>
                <span>
                  Sincroniza
                  <small>cuando tengas conexión</small>
                </span>
              </div>
            </div>

            <p className="login__version">v1.0.0</p>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
