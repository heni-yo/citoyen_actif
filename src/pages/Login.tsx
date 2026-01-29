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
  IonSegment,
  IonSegmentButton,
  IonAlert,
  IonSpinner,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import './Login.css';

const Login: React.FC = () => {
  const [courriel, setCourriel] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citoyen');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async () => {
    if (!courriel || !password) {
      setAlertMessage('Veuillez remplir tous les champs');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    const success = await login(courriel, password, role);
    setLoading(false);

    if (success) {
      // Petit délai pour s'assurer que le contexte est bien mis à jour
      setTimeout(() => {
      if (role === 'citoyen') {
          window.location.href = '/citoyen/tabs/rapports';
      } else {
          window.location.href = '/employe/tabs/tous-les-rapports';
      }
      }, 100);
    } else {
      setAlertMessage('Email ou mot de passe incorrect');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Citoyen Actif</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Connexion</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSegment value={role} onIonChange={(e) => setRole(e.detail.value as UserRole)}>
                <IonSegmentButton value="citoyen">
                  <IonLabel>Citoyen</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="employe">
                  <IonLabel>Employé</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              <IonItem>
                <IonLabel position="stacked">Courriel</IonLabel>
                <IonInput
                  type="email"
                  value={courriel}
                  onIonInput={(e) => setCourriel(e.detail.value!)}
                  placeholder="votre@email.com"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Mot de passe</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  placeholder="••••••••"
                />
              </IonItem>

              <IonButton expand="block" onClick={handleLogin} disabled={loading} className="ion-margin-top">
                {loading ? <IonSpinner name="crescent" /> : 'Se connecter'}
              </IonButton>

              {role === 'citoyen' && (
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={() => history.push('/register')}
                  className="ion-margin-top"
                >
                  Créer un compte
                </IonButton>
              )}

              {role === 'employe' && (
                <div className="ion-margin-top ion-text-center">
                  <small>Compte par défaut: employe@municipalite.ca / employe123</small>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Erreur"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;

