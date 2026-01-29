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
  IonSpinner,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register: React.FC = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [courriel, setCourriel] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const history = useHistory();

  const handleRegister = async () => {
    if (!nom || !prenom || !courriel || !password || !confirmPassword) {
      setAlertMessage('Veuillez remplir tous les champs');
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Les mots de passe ne correspondent pas');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    const success = await register(nom, prenom, courriel, password);
    setLoading(false);

    if (success) {
      // Petit délai pour s'assurer que le contexte est bien mis à jour
      setTimeout(() => {
        window.location.href = '/citoyen/tabs/rapports';
      }, 100);
    } else {
      setAlertMessage('Erreur lors de l\'inscription. Cet email est peut-être déjà utilisé.');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="register-container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Créer un compte</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Nom *</IonLabel>
                <IonInput
                  type="text"
                  value={nom}
                  onIonInput={(e) => setNom(e.detail.value!)}
                  placeholder="Votre nom"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Prénom *</IonLabel>
                <IonInput
                  type="text"
                  value={prenom}
                  onIonInput={(e) => setPrenom(e.detail.value!)}
                  placeholder="Votre prénom"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Courriel *</IonLabel>
                <IonInput
                  type="email"
                  value={courriel}
                  onIonInput={(e) => setCourriel(e.detail.value!)}
                  placeholder="votre@email.com"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Mot de passe *</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  placeholder="••••••••"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Confirmer le mot de passe *</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                  placeholder="••••••••"
                />
              </IonItem>

              <IonButton expand="block" onClick={handleRegister} disabled={loading} className="ion-margin-top">
                {loading ? <IonSpinner name="crescent" /> : 'S\'inscrire'}
              </IonButton>

              <IonButton
                expand="block"
                fill="clear"
                onClick={() => history.push('/login')}
                className="ion-margin-top"
              >
                Déjà un compte ? Se connecter
              </IonButton>
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

export default Register;

