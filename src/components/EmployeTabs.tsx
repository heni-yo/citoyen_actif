import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { list, map } from 'ionicons/icons';
import TousLesRapports from '../pages/employe/TousLesRapports';
import CarteRapportsEmploye from '../pages/employe/CarteRapportsEmploye';

const EmployeTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/employe/tabs/tous-les-rapports">
          <TousLesRapports />
        </Route>
        <Route exact path="/employe/tabs/carte">
          <CarteRapportsEmploye />
        </Route>
        <Route exact path="/employe">
          <Redirect to="/employe/tabs/tous-les-rapports" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tous-les-rapports" href="/employe/tabs/tous-les-rapports">
          <IonIcon icon={list} />
          <IonLabel>Tous les rapports</IonLabel>
        </IonTabButton>
        <IonTabButton tab="carte" href="/employe/tabs/carte">
          <IonIcon icon={map} />
          <IonLabel>Carte</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default EmployeTabs;

