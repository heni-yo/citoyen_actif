import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CitoyenTabs from './components/CitoyenTabs';
import EmployeTabs from './components/EmployeTabs';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Routes publiques */}
        <Route exact path="/login">
          {isAuthenticated ? (
            user?.role === 'citoyen' ? (
              <Redirect to="/citoyen/tabs/rapports" />
            ) : (
              <Redirect to="/employe/tabs/tous-les-rapports" />
            )
          ) : (
            <Login />
          )}
        </Route>
        <Route exact path="/register">
          {isAuthenticated ? (
            <Redirect to="/citoyen/tabs/rapports" />
          ) : (
            <Register />
          )}
        </Route>

        {/* Routes citoyen */}
        <Route path="/citoyen">
          {isAuthenticated && user?.role === 'citoyen' ? (
            <CitoyenTabs />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {/* Routes employé */}
        <Route path="/employe">
          {isAuthenticated && user?.role === 'employe' ? (
            <EmployeTabs />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {/* Route par défaut */}
        <Route exact path="/">
          {isAuthenticated ? (
            user?.role === 'citoyen' ? (
              <Redirect to="/citoyen/tabs/rapports" />
            ) : (
              <Redirect to="/employe/tabs/tous-les-rapports" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </IonApp>
);

export default App;
