import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profil.css';

const Profil: React.FC = () => {
  const { user, logout } = useAuth();
  const [nom, setNom] = useState(user?.nom || '');
  const [prenom, setPrenom] = useState(user?.prenom || '');
  const [courriel, setCourriel] = useState(user?.courriel || '');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleUpdate = () => {
    // Dans une vraie app, mettre à jour via l'API
    setAlertMessage('Fonctionnalité de mise à jour à implémenter');
    setShowAlert(true);
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mon profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Informations personnelles</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Nom</IonLabel>
              <IonInput
                value={nom}
                onIonInput={(e) => setNom(e.detail.value!)}
                placeholder="Votre nom"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Prénom</IonLabel>
              <IonInput
                value={prenom}
                onIonInput={(e) => setPrenom(e.detail.value!)}
                placeholder="Votre prénom"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Courriel</IonLabel>
              <IonInput
                type="email"
                value={courriel}
                onIonInput={(e) => setCourriel(e.detail.value!)}
                placeholder="votre@email.com"
              />
            </IonItem>

            <IonButton expand="block" onClick={handleUpdate} className="ion-margin-top">
              Enregistrer les modifications
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Se déconnecter
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Information"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profil;

