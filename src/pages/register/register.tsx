import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonCheckbox,
  IonIcon,
  IonSelect,
  IonRouterLink,
  useIonRouter,
  useIonToast,
  IonSelectOption,
} from '@ionic/react';
import {
  arrowBackOutline,
  arrowForwardOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  businessOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
  leafOutline,
} from 'ionicons/icons';
import { useState } from 'react';

import './register.css';
import { registerUser } from '../../services/auth.service';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      presentToast({
        message: 'Las contraseñas no coinciden.',
        duration: 2500,
        color: 'danger',
      });
      return;
    }

    if (password.length < 8) {
      presentToast({
        message: 'La contraseña debe tener mínimo 8 caracteres.',
        duration: 2500,
        color: 'danger',
      });
      return;
    }

    if (!company.trim()) {
      presentToast({
        message: 'Selecciona una empresa.',
        duration: 2500,
        color: 'warning',
      });
      return;
    }

    const result = registerUser({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      company,
    });

    presentToast({
      message: result.message,
      duration: 2500,
      color: result.success ? 'success' : 'danger',
    });

    if (result.success) {
      router.push('/login', 'root', 'replace');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="register-content">
        <div className="register-page">
          {/* ENCABEZADO */}
          <header className="register-topbar">
            <IonRouterLink routerLink="/login" className="register-back">
              <IonIcon icon={arrowBackOutline} />
            </IonRouterLink>

            <div className="register-brand">
              <strong>SST-Inspector Móvil</strong>
              <span>Seguridad hoy, entornos más saludables</span>
            </div>

            <div className="register-brand-logo">
              <IonIcon icon={shieldCheckmarkOutline} />
            </div>
          </header>

          {/* CONTENIDO */}
          <main className="register-container">
            <section className="register-intro">
              <h1>Registro de usuario</h1>

              <p>Crea tu cuenta para comenzar a realizar inspecciones de Seguridad y Salud en el Trabajo.</p>
            </section>

            <form onSubmit={handleSubmit} className="register-form">
              {/* NOMBRE */}
              <div className="register-field">
                <IonIcon icon={personOutline} />

                <div className="register-input">
                  <label>Nombre completo</label>

                  <IonInput
                    value={fullName}
                    placeholder="Ingresa tu nombre y apellidos"
                    onIonInput={(e) => setFullName(e.detail.value ?? '')}
                    required
                  />
                </div>
              </div>

              {/* CORREO */}
              <div className="register-field">
                <IonIcon icon={mailOutline} />

                <div className="register-input">
                  <label>Correo institucional</label>

                  <IonInput
                    type="email"
                    value={email}
                    placeholder="ejemplo@empresa.com"
                    onIonInput={(e) => setEmail(e.detail.value ?? '')}
                    required
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}
              <div className="register-field">
                <IonIcon icon={lockClosedOutline} />

                <div className="register-input">
                  <label>Contraseña</label>

                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="Mínimo 8 caracteres"
                    minlength={8}
                    onIonInput={(e) => setPassword(e.detail.value ?? '')}
                    required
                  />
                </div>

                <IonButton
                  fill="clear"
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </div>

              {/* CONFIRMAR CONTRASEÑA */}
              <div className="register-field">
                <IonIcon icon={lockClosedOutline} />

                <div className="register-input">
                  <label>Confirmar contraseña</label>

                  <IonInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    placeholder="Repite tu contraseña"
                    onIonInput={(e) => setConfirmPassword(e.detail.value ?? '')}
                    required
                  />
                </div>

                <IonButton
                  fill="clear"
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </div>

              {/* EMPRESA */}
              <div className="register-field">
                <IonIcon icon={businessOutline} />

                <div className="register-input">
                  <label>Empresa</label>

                  <IonSelect
                    value={company}
                    placeholder="Selecciona tu empresa"
                    interface="popover"
                    onIonChange={(e) => setCompany(e.detail.value)}
                  >
                    <IonSelectOption value="Empresa de prueba">Empresa de prueba</IonSelectOption>
                    <IonSelectOption value="Otra empresa">Otra empresa</IonSelectOption>
                  </IonSelect>
                </div>
              </div>

              {/* TERMINOS */}
              <div className="register-terms">
                <IonCheckbox checked={acceptedTerms} onIonChange={(e) => setAcceptedTerms(e.detail.checked)} />

                <span>
                  Acepto los <a href="#terminos">términos y condiciones</a> y la{' '}
                  <a href="#privacidad">política de privacidad</a>.
                </span>
              </div>

              {/* CREAR CUENTA */}
              <IonButton expand="block" type="submit" className="register-submit" disabled={!acceptedTerms}>
                Crear cuenta
                <IonIcon icon={arrowForwardOutline} slot="end" />
              </IonButton>

              {/* VOLVER */}
              <IonButton expand="block" fill="outline" routerLink="/login" className="register-login">
                <IonIcon icon={arrowBackOutline} slot="start" />
                Volver al inicio de sesión
              </IonButton>
            </form>

            {/* INFORMACION DE SEGURIDAD */}
            <section className="register-security">
              <IonIcon icon={informationCircleOutline} />

              <div>
                <strong>Tu información está segura</strong>

                <p>
                  Utilizamos medidas de seguridad para proteger tus datos personales y cumplir con la normativa vigente
                  de protección de datos.
                </p>
              </div>
            </section>
          </main>

          {/* FOOTER */}
          <footer className="register-footer">
            <IonIcon icon={leafOutline} />

            <div>
              <strong>SST-Inspector Móvil</strong>
              <span>Prevención segura, empresas más fuertes.</span>
            </div>

            <small>v1.0.0</small>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
