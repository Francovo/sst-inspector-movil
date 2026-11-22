import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  arrowBackOutline,
  arrowForwardOutline,
  businessOutline,
  chevronBackOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import BrandMark from '../../components/BrandMark';
import NoteBanner from '../../components/NoteBanner';
import PasswordField from '../../components/form/PasswordField';
import SelectField from '../../components/form/SelectField';
import TextField from '../../components/form/TextField';
import './Registro.css';

/**
 * Visual mockup of the "Registro de Usuario" screen.
 * Creating an account only navigates to the dashboard; nothing is persisted.
 */
const Registro = (): JSX.Element => {
  const navigate = useNavigate();

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
                <TextField
                  autoComplete="name"
                  icon={personOutline}
                  id="registro-nombre"
                  label="Nombre completo *"
                  placeholder="Ingresa tu nombre y apellidos"
                  type="text"
                />

                <TextField
                  autoComplete="email"
                  icon={mailOutline}
                  id="registro-email"
                  label="Correo institucional"
                  placeholder="ejemplo@empresa.com"
                  type="email"
                />

                <PasswordField
                  autoComplete="new-password"
                  icon={lockClosedOutline}
                  id="registro-password"
                  label="Contraseña"
                  placeholder="Mínimo 8 caracteres"
                />

                <PasswordField
                  autoComplete="new-password"
                  icon={lockClosedOutline}
                  id="registro-confirmacion"
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                />

                <SelectField defaultValue="" icon={businessOutline} id="registro-empresa" label="Empresa">
                  <option disabled value="">
                    Selecciona tu empresa
                  </option>
                  <option value="cafe">Industrias del Café S.A.S.</option>
                  <option value="constructora">Constructora Bolívar</option>
                  <option value="logistica">Logística &amp; Envíos del Caribe</option>
                  <option value="manufacturas">Manufacturas Andinas</option>
                </SelectField>

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

            <NoteBanner icon={shieldCheckmarkOutline} title="Tu información está segura" tone="success">
              Utilizamos medidas de seguridad para proteger tus datos personales y cumplir con la normativa vigente de
              protección de datos.
            </NoteBanner>

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
