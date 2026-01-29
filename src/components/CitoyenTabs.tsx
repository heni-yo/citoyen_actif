import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { list, map, person, add } from 'ionicons/icons';
import MesRapports from '../pages/citoyen/MesRapports';
import CarteRapports from '../pages/citoyen/CarteRapports';
import Profil from '../pages/citoyen/Profil';
import CreerRapport from '../pages/citoyen/CreerRapport';

const CitoyenTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/citoyen/tabs/rapports">
          <MesRapports />
        </Route>
        <Route exact path="/citoyen/tabs/creer">
          <CreerRapport />
        </Route>
        <Route exact path="/citoyen/tabs/carte">
          <CarteRapports />
        </Route>
        <Route exact path="/citoyen/tabs/profil">
          <Profil />
        </Route>
        <Route exact path="/citoyen">
          <Redirect to="/citoyen/tabs/rapports" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="rapports" href="/citoyen/tabs/rapports">
          <IonIcon icon={list} />
          <IonLabel>Mes rapports</IonLabel>
        </IonTabButton>
        <IonTabButton tab="creer" href="/citoyen/tabs/creer">
          <IonIcon icon={add} />
          <IonLabel>Créer</IonLabel>
        </IonTabButton>
        <IonTabButton tab="carte" href="/citoyen/tabs/carte">
          <IonIcon icon={map} />
          <IonLabel>Carte</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profil" href="/citoyen/tabs/profil">
          <IonIcon icon={person} />
          <IonLabel>Profil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default CitoyenTabs;

