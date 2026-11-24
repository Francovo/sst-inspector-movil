import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import type { JSX } from 'react';
import { Navigate, Route } from 'react-router-dom';

import { NetworkStatusProvider } from './features/network/NetworkStatusProvider';
import Evidencias from './pages/Evidencias';
import Sincronizacion from './pages/Sincronizacion';
import Dashboard from './pages/dashboard/dashboard';
import Inspeccion from './pages/inspeccion/Inspeccion';
import Listas from './pages/listas/Listas';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Resumen from './pages/resumen/Resumen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Design tokens and shared UI primitives */
import './theme/variables.css';
import './theme/ui.css';

setupIonicReact();

// The app is light-only: the shared palette has no dark variant.
const App = (): JSX.Element => (
  <IonApp>
    <NetworkStatusProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listas" element={<Listas />} />
          <Route path="/inspeccion" element={<Inspeccion />} />
          <Route path="/evidencias" element={<Evidencias />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/sincronizacion" element={<Sincronizacion />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </NetworkStatusProvider>
  </IonApp>
);

export default App;
