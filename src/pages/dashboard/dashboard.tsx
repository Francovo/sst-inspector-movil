import {
  IonContent,
  IonIcon,
  IonMenuToggle,
  IonPage,
  useIonRouter,
  useIonToast,
} from '@ionic/react';

import {
  addCircleOutline,
  barChartOutline,
  calendarOutline,
  cameraOutline,
  chevronForwardOutline,
  clipboardOutline,
  home,
  informationCircleOutline,
  leaf,
  logOutOutline,
  menuOutline,
  refreshOutline,
  settingsOutline,
  shieldCheckmark,
  wifi,
} from 'ionicons/icons';

import { useEffect, useState } from 'react';

import DashboardMenu from '../../components/DashboardMenu';

import {
  getCurrentUser,
  logoutUser,
  type User,
} from '../../services/auth.service';

import './dashboard.css';

const Dashboard: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [user, setUser] = useState<User | null>(null);

  // Fecha actual
  const fecha = new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  // Obtener usuario y verificar sesión
  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push('/login', 'root', 'replace');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(currentUser);
  }, [router]);

  // Cerrar sesión
  const handleLogout = () => {
    logoutUser();

    presentToast({
      message: 'Sesión cerrada correctamente.',
      duration: 1500,
      color: 'success',
      position: 'bottom',
    });

    router.push('/login', 'root', 'replace');
  };

  // Evitar mostrar el Dashboard mientras se verifica la sesión
  if (!user) {
    return null;
  }

  return (
    <IonPage>
      {/* MENÚ LATERAL */}
      <DashboardMenu onLogout={handleLogout} />

      <IonContent fullscreen className="dashboard-content">
        <main
          id="dashboard-content"
          className="dashboard-container"
        >
          {/* HEADER */}
          <header className="dashboard-header">
            <IonMenuToggle autoHide={false}>
              <button
                className="dashboard-menu-button"
                type="button"
                aria-label="Menú"
              >
                <IonIcon icon={menuOutline} />
              </button>
            </IonMenuToggle>

            <div className="dashboard-logo">
              <IonIcon icon={shieldCheckmark} />
            </div>

            <div className="dashboard-brand">
              <strong>SST-Inspector Móvil</strong>
              <span>
                Inspecciones hoy, entornos más seguros
              </span>
            </div>

            <div className="connection-badge">
              <IonIcon icon={wifi} />

              <div>
                <strong>En línea</strong>
                <small>Conectado a internet</small>
              </div>
            </div>

            <button
              type="button"
              className="dashboard-menu-button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <IonIcon icon={logOutOutline} />
            </button>
          </header>

          {/* CONTENIDO */}
          <section className="dashboard-main">
            {/* PERFIL */}
            <article className="inspector-card">
              <div className="inspector-avatar">
                <span>👤</span>
              </div>

              <div className="inspector-information">
                <strong>¡Hola, Inspector!</strong>

                <span>{user.fullName}</span>

                <p>
                  Tu trabajo contribuye a entornos más seguros
                </p>
              </div>

              <div className="dashboard-date">
                <IonIcon icon={calendarOutline} />

                <div>
                  <strong>{fecha}</strong>

                  <small>
                    Semana{' '}
                    {Math.ceil(
                      (new Date().getDate() +
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1,
                        ).getDay()) /
                        7,
                    )}
                  </small>
                </div>
              </div>
            </article>

            {/* BANNER */}
            <section className="dashboard-banner">
              <div className="banner-leaf">
                <IonIcon icon={leaf} />
              </div>

              <div className="banner-text">
                <strong>
                  Prevenir hoy,
                  <br />
                  protege mañana
                </strong>

                <p>
                  Seguridad y Salud en el Trabajo para un mejor
                  futuro
                </p>
              </div>

              <div className="banner-worker">👷</div>

              <div className="banner-message">
                PERSONAS
                <br />
                SEGURAS
                <br />
                EMPRESAS
                <br />
                MÁS FUERTES
              </div>
            </section>

            {/* ACCESOS RÁPIDOS */}
            <section className="dashboard-shortcuts">
              <button
                type="button"
                className="shortcut-card shortcut-primary"
              >
                <IonIcon icon={addCircleOutline} />

                <strong>Nueva inspección</strong>

                <p>Inicia una nueva inspección de SST</p>

                <IonIcon
                  icon={chevronForwardOutline}
                  className="shortcut-arrow"
                />
              </button>

              <button
                type="button"
                className="shortcut-card"
              >
                <div className="shortcut-icon-wrapper">
                  <IonIcon icon={clipboardOutline} />

                  <span className="notification-count">
                    3
                  </span>
                </div>

                <strong>Inspecciones pendientes</strong>

                <p>
                  Revisa y continúa las inspecciones guardadas
                </p>

                <IonIcon
                  icon={chevronForwardOutline}
                  className="shortcut-arrow"
                />
              </button>

              <button
                type="button"
                className="shortcut-card"
              >
                <IonIcon icon={barChartOutline} />

                <strong>Reportes sincronizados</strong>

                <p>Consulta tus reportes en la nube</p>

                <IonIcon
                  icon={chevronForwardOutline}
                  className="shortcut-arrow"
                />
              </button>
            </section>

            {/* RESUMEN */}
            <section className="inspection-summary">
              <div className="summary-header">
                <IonIcon icon={barChartOutline} />

                <div>
                  <strong>Resumen de inspecciones</strong>

                  <span>
                    Estado actual en este dispositivo
                  </span>
                </div>
              </div>

              <div className="summary-stats">
                <div className="summary-stat">
                  <strong className="stat-pending">
                    3
                  </strong>
                  <span>Pendientes</span>
                </div>

                <div className="summary-stat">
                  <strong className="stat-completed">
                    5
                  </strong>
                  <span>Completadas</span>
                </div>

                <div className="summary-stat">
                  <strong className="stat-synced">
                    8
                  </strong>
                  <span>Sincronizadas</span>
                </div>

                <div className="summary-stat">
                  <strong className="stat-errors">
                    0
                  </strong>
                  <span>Con errores</span>
                </div>
              </div>

              <button
                type="button"
                className="sync-button"
                onClick={() =>
                  router.push(
                    '/sincronizacion',
                    'forward',
                    'push',
                  )
                }
              >
                <IonIcon icon={refreshOutline} />
                Ver sincronización
              </button>
            </section>

            {/* ESTADO DE CONEXIÓN */}
            <section className="connection-information">
              <IonIcon icon={informationCircleOutline} />

              <div>
                <strong>
                  Estás trabajando sin conexión.
                </strong>

                <p>
                  Puedes realizar inspecciones y guardar tus datos.
                  Cuando tengas internet, se sincronizarán
                  automáticamente.
                </p>
              </div>
            </section>
          </section>

          {/* NAVEGACIÓN INFERIOR */}
          <nav className="dashboard-tabbar">
            <button
              type="button"
              className="tab-item tab-active"
            >
              <IonIcon icon={home} />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              className="tab-item"
            >
              <IonIcon icon={clipboardOutline} />
              <span>Inspecciones</span>
            </button>

            <button
              type="button"
              className="tab-item"
              onClick={() =>
                router.push(
                  '/evidencias',
                  'forward',
                  'push',
                )
              }
            >
              <IonIcon icon={cameraOutline} />
              <span>Evidencias</span>
            </button>

            <button
              type="button"
              className="tab-item"
            >
              <IonIcon icon={barChartOutline} />
              <span>Reportes</span>
            </button>

            <IonMenuToggle autoHide={false}>
              <button
                type="button"
                className="tab-item"
              >
                <IonIcon icon={settingsOutline} />
                <span>Más</span>
              </button>
            </IonMenuToggle>
          </nav>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;