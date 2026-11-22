import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import type { JSX } from 'react';
import { Navigate, Route } from 'react-router-dom';

import { InspectionDraftProvider } from './features/inspection/InspectionDraftProvider';
import Firma from './pages/firma/Firma';
import Login from './pages/login/Login';
import Registro from './pages/registro/Registro';
import Resumen from './pages/resumen/Resumen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
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

// The mockup is light-only: the Stitch screens have no dark variant, so the
// `dark.system.css` palette is intentionally not imported.
const App = (): JSX.Element => (
  <IonApp>
    <InspectionDraftProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/firma" element={<Firma />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </InspectionDraftProvider>
  </IonApp>
);

export default App;
