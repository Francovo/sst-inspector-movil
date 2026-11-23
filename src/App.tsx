import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router';

import Dashboard from './pages/dashboard/dashboard';
import Login from './pages/login/login';
import Register from './pages/register/register';

import Evidencias from './pages/Evidencias';
import Sincronizacion from './pages/Sincronizacion';

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

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
	<IonReactRouter>
		<IonRouterOutlet>
			<Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/evidencias" element={<Evidencias/>} />
        <Route path="/sincronizacion" element={<Sincronizacion/>}
        />
        <Route path="/" element={<Navigate to="/login" replace/>}
        />
      </IonRouterOutlet>
	</IonReactRouter>
</IonApp>
);

export default App;