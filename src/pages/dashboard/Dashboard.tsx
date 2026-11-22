import { IonIcon } from '@ionic/react';
import {
  addOutline,
  barChartOutline,
  calendarClearOutline,
  chevronForward,
  clipboardOutline,
  cloudOfflineOutline,
  informationCircle,
  pieChartOutline,
  syncOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import NoteBanner from '../../components/NoteBanner';
import PageShell from '../../components/PageShell';
import { useNetworkStatus } from '../../features/network/networkContext';
import { DEMO_USER } from '../../features/session/demoUser';
import './Dashboard.css';

const QUICK_ACTIONS = [
  {
    id: 'nueva',
    title: 'Nueva inspección',
    description: 'Inicia una nueva inspección de SST',
    icon: addOutline,
    tone: 'green',
    to: '/listas',
  },
  {
    id: 'pendientes',
    title: 'Inspecciones pendientes',
    description: 'Revisa y continúa las inspecciones guardadas',
    icon: clipboardOutline,
    tone: 'slate',
    badge: '3',
    to: '/listas',
  },
  {
    id: 'reportes',
    title: 'Reportes sincronizados',
    description: 'Consulta tus reportes en la nube',
    icon: barChartOutline,
    tone: 'blue',
    to: '/resumen',
  },
] as const;

const METRICS = [
  { id: 'pendientes', label: 'Pendientes', value: 3, tone: 'pending' },
  { id: 'completadas', label: 'Completadas', value: 5, tone: 'done' },
  { id: 'sincronizadas', label: 'Sincronizadas', value: 8, tone: 'synced' },
  { id: 'errores', label: 'Con errores', value: 0, tone: 'error' },
] as const;

/**
 * Visual mockup of the "Dashboard Principal" screen.
 * Every counter is demo content: the inspection domain does not exist yet.
 */
const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const { online } = useNetworkStatus();

  return (
    <PageShell header={{ withMenu: true }} tab="inicio">
      <div className="inicio">
        <section className="inicio__greeting">
          <div className="inicio__user">
            <span aria-hidden="true" className="inicio__avatar">
              {DEMO_USER.initials}
            </span>
            <div>
              <span className="inicio__hello">¡Hola, Inspector!</span>
              <strong>{DEMO_USER.shortName}</strong>
              <p>Tu trabajo contribuye a entornos más seguros</p>
            </div>
          </div>

          <div className="inicio__date">
            <span>
              <IonIcon aria-hidden="true" icon={calendarClearOutline} />
              Mar, 10 Nov 2026
            </span>
            <small>Semana 46</small>
          </div>
        </section>

        <section className="inicio__hero">
          <div className="inicio__hero-copy">
            <h2>
              Prevenir hoy,
              <br />
              <span>protege mañana</span>
            </h2>
            <p>Seguridad y Salud en el Trabajo para un mejor futuro</p>
          </div>

          <div aria-hidden="true" className="inicio__worker">
            <span className="inicio__helmet">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C7.58 3 4 6.58 4 11v1h16v-1c0-4.42-3.58-8-8-8z" />
                <path d="M21 13H3c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1z" />
                <path d="M11 5h2v6h-2z" />
              </svg>
            </span>
            <span className="inicio__vest" />
            <span className="inicio__slogan">
              <strong>Personas seguras</strong>
              <small>Empresas más fuertes</small>
            </span>
          </div>
        </section>

        <section aria-label="Accesos rápidos" className="inicio__quick">
          {QUICK_ACTIONS.map((action) => (
            <button
              className={`inicio__quick-card inicio__quick-card--${action.tone}`}
              key={action.id}
              onClick={() => navigate(action.to)}
              type="button"
            >
              <span className="inicio__quick-top">
                <span className="inicio__quick-icon">
                  <IonIcon aria-hidden="true" icon={action.icon} />
                </span>
                {'badge' in action && <span className="inicio__quick-badge">{action.badge}</span>}
              </span>
              <span className="inicio__quick-copy">
                <strong>{action.title}</strong>
                <small>{action.description}</small>
              </span>
              <IonIcon aria-hidden="true" className="inicio__quick-arrow" icon={chevronForward} />
            </button>
          ))}
        </section>

        <section className="sst-card inicio__summary">
          <div className="inicio__summary-head">
            <span className="inicio__summary-icon">
              <IonIcon aria-hidden="true" icon={pieChartOutline} />
            </span>
            <div>
              <h2>Resumen de inspecciones</h2>
              <p>Estado actual en este dispositivo</p>
            </div>
          </div>

          <div className="inicio__metrics">
            {METRICS.map((metric) => (
              <div className={`inicio__metric inicio__metric--${metric.tone}`} key={metric.id}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <button className="inicio__sync" type="button">
            <IonIcon aria-hidden="true" icon={syncOutline} />
            Ver sincronización
          </button>
        </section>

        <NoteBanner
          icon={online ? informationCircle : cloudOfflineOutline}
          title={online ? 'Estás trabajando en línea.' : 'Estás trabajando sin conexión.'}
          tone={online ? 'info' : 'success'}
        >
          {online
            ? 'Puedes realizar inspecciones y guardar tus datos. Cuando tengas internet, se sincronizarán automáticamente.'
            : 'Tus inspecciones y evidencias se guardan en este dispositivo. Se sincronizarán cuando recuperes la conexión.'}
        </NoteBanner>
      </div>
    </PageShell>
  );
};

export default Dashboard;
