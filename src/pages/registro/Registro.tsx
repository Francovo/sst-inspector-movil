import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  arrowBackOutline,
  arrowForwardOutline,
  businessOutline,
  chevronBackOutline,
  chevronDownOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BrandMark from '../../components/BrandMark';
import './Registro.css';

/**
 * Visual mockup of the "Registro de Usuario" screen.
 * Creating an account only navigates to the dashboard; nothing is persisted.
 */
const Registro = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <IonPage>
      <IonContent className="sst-screen">
        <div className="registro">
          <header className="registro__bar">
            <button
              aria-label="Volver al inicio de sesión"
              className="registro__back"
              onClick={() => navigate('/login')}
              type="button"
            >
              <IonIcon aria-hidden="true" icon={chevronBackOutline} />
            </button>

            <div className="registro__brand">
              <h1>SST-Inspector Móvil</h1>
              <p>Seguridad hoy, entornos más saludables</p>
            </div>

            <span className="registro__mark">
              <BrandMark />
            </span>
          </header>

          <main className="registro__body">
            <section className="sst-card registro__card">
              <header className="registro__heading">
                <h2>Registro de usuario</h2>
                <p>Crea tu cuenta para comenzar a realizar inspecciones de Seguridad y Salud en el Trabajo.</p>
              </header>

              <form
                className="registro__form"
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate('/inicio');
                }}
              >
                <div className="sst-field">
                  <label className="sst-field__label" htmlFor="registro-nombre">
                    Nombre completo *
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={personOutline} />
                    </span>
                    <input
                      autoComplete="name"
                      className="sst-input"
                      id="registro-nombre"
                      placeholder="Ingresa tu nombre y apellidos"
                      type="text"
                    />
                  </div>
                </div>

                <div className="sst-field">
                  <label className="sst-field__label" htmlFor="registro-email">
                    Correo institucional
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={mailOutline} />
                    </span>
                    <input
                      autoComplete="email"
                      className="sst-input"
                      id="registro-email"
                      placeholder="ejemplo@empresa.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="sst-field registro__field--password">
                  <label className="sst-field__label" htmlFor="registro-password">
                    Contraseña
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={lockClosedOutline} />
                    </span>
                    <input
                      autoComplete="new-password"
                      className="sst-input"
                      id="registro-password"
                      placeholder="Mínimo 8 caracteres"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="registro__eye"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                    </button>
                  </div>
                </div>

                <div className="sst-field registro__field--password">
                  <label className="sst-field__label" htmlFor="registro-confirmacion">
                    Confirmar contraseña
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={lockClosedOutline} />
                    </span>
                    <input
                      autoComplete="new-password"
                      className="sst-input"
                      id="registro-confirmacion"
                      placeholder="Repite tu contraseña"
                      type={showConfirmation ? 'text' : 'password'}
                    />
                    <button
                      aria-label={showConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="registro__eye"
                      onClick={() => setShowConfirmation((current) => !current)}
                      type="button"
                    >
                      <IonIcon icon={showConfirmation ? eyeOffOutline : eyeOutline} />
                    </button>
                  </div>
                </div>

                <div className="sst-field">
                  <label className="sst-field__label" htmlFor="registro-empresa">
                    Empresa
                  </label>
                  <div className="sst-field__control">
                    <span aria-hidden="true" className="sst-field__icon">
                      <IonIcon icon={businessOutline} />
                    </span>
                    <select className="registro__select" defaultValue="" id="registro-empresa">
                      <option disabled value="">
                        Selecciona tu empresa
                      </option>
                      <option value="cafe">Industrias del Café S.A.S.</option>
                      <option value="constructora">Constructora Bolívar</option>
                      <option value="logistica">Logística &amp; Envíos del Caribe</option>
                      <option value="manufacturas">Manufacturas Andinas</option>
                    </select>
                    <span aria-hidden="true" className="registro__chevron">
                      <IonIcon icon={chevronDownOutline} />
                    </span>
                  </div>
                </div>

                <div className="registro__terms">
                  <input id="registro-terminos" type="checkbox" />
                  <label htmlFor="registro-terminos">
                    Acepto los{' '}
                    <button className="registro__link" type="button">
                      términos y condiciones
                    </button>{' '}
                    y la{' '}
                    <button className="registro__link" type="button">
                      política de privacidad
                    </button>
                    .
                  </label>
                </div>

                <button className="sst-button sst-button--primary sst-button--block" type="submit">
                  Crear cuenta
                  <IonIcon aria-hidden="true" icon={arrowForwardOutline} />
                </button>

                <button
                  className="sst-button sst-button--outline sst-button--block"
                  onClick={() => navigate('/login')}
                  type="button"
                >
                  <IonIcon aria-hidden="true" icon={arrowBackOutline} />
                  Volver al inicio de sesión
                </button>
              </form>
            </section>

            <aside className="sst-note sst-note--success">
              <IonIcon aria-hidden="true" icon={shieldCheckmarkOutline} />
              <div>
                <h3>Tu información está segura</h3>
                <p>
                  Utilizamos medidas de seguridad para proteger tus datos personales y cumplir con la normativa vigente
                  de protección de datos.
                </p>
              </div>
            </aside>

            <footer className="registro__footer">
              <div className="registro__footer-brand">
                <span className="registro__footer-mark">
                  <BrandMark />
                </span>
                <div>
                  <p>SST-Inspector Móvil</p>
                  <small>Prevención segura, empresas más fuertes</small>
                </div>
              </div>
              <span className="registro__version">v1.0.0</span>
            </footer>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;
