import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
  IonSpinner,
  IonImg,
  IonActionSheet,
  useIonViewWillEnter,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { camera, images } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { useAuth } from '../../context/AuthContext';
import { rapportService } from '../../services/rapportService';
import { RapportCategorie } from '../../types';
import './CreerRapport.css';

const CreerRapport: React.FC = () => {
  const [rapportId, setRapportId] = useState<string | null>(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState<RapportCategorie>('Autre');
  const [adresse, setAdresse] = useState('');
  const [latitude, setLatitude] = useState(45.5017);
  const [longitude, setLongitude] = useState(-73.5673);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const { user } = useAuth();
  const history = useHistory();

  const resetForm = () => {
    setRapportId(null);
    setTitre('');
    setDescription('');
    setCategorie('Autre');
    setAdresse('');
    setLatitude(45.5017);
    setLongitude(-73.5673);
    setImage(undefined);
  };

  useIonViewWillEnter(() => {
    const rapportToEdit = localStorage.getItem('rapport_to_edit');
    if (rapportToEdit) {
      const rapport = JSON.parse(rapportToEdit);
      setRapportId(rapport.id);
      setTitre(rapport.titre);
      setDescription(rapport.description);
      setCategorie(rapport.categorie);
      setAdresse(rapport.adresse || '');
      setLatitude(rapport.latitude);
      setLongitude(rapport.longitude);
      setImage(rapport.image);
      localStorage.removeItem('rapport_to_edit');
    } else {
      resetForm();
    }
  });

  const takePicture = async (source: CameraSource) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
      });

      setImage(`data:image/${image.format};base64,${image.base64String}`);
      setShowActionSheet(false);
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      setAlertMessage('Erreur lors de la prise de photo');
      setShowAlert(true);
    }
  };

  const handleImageOptions = () => {
    setShowActionSheet(true);
  };

  const handleGeolocation = async () => {
    setGettingLocation(true);
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        await Geolocation.requestPermissions();
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      setAlertMessage('Impossible d\'obtenir votre position. Vérifiez que la géolocalisation est activée.');
      setShowAlert(true);
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!titre || !description || !categorie) {
      setAlertMessage('Veuillez remplir tous les champs obligatoires');
      setShowAlert(true);
      return;
    }

    if (!user) {
      setAlertMessage('Vous devez être connecté');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      if (rapportId) {
        const success = await rapportService.updateRapport(
          rapportId,
          titre,
          description,
          categorie,
          latitude,
          longitude,
          adresse,
          image
        );
        if (success) {
          setAlertMessage('Rapport modifié avec succès');
        } else {
          setAlertMessage('Erreur lors de la modification du rapport');
        }
      } else {
        const rapport = await rapportService.createRapport(
          titre,
          description,
          categorie,
          latitude,
          longitude,
          adresse,
          image,
          user.id,
          `${user.prenom} ${user.nom}`
        );
      }
      setLoading(false);
      setTimeout(() => {
        history.push('/citoyen/tabs/rapports');
      }, 100);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setLoading(false);
      setAlertMessage('Erreur lors de la sauvegarde du rapport');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{rapportId ? 'Modifier le rapport' : 'Créer un rapport'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{rapportId ? 'Modifier le signalement' : 'Nouveau signalement'}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Titre *</IonLabel>
              <IonInput
                value={titre}
                onIonInput={(e) => setTitre(e.detail.value!)}
                placeholder="Ex: Lumière défectueuse"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Description *</IonLabel>
              <IonTextarea
                value={description}
                onIonInput={(e) => setDescription(e.detail.value!)}
                placeholder="Décrivez le problème..."
                rows={4}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Catégorie *</IonLabel>
              <IonSelect value={categorie} onIonChange={(e) => setCategorie(e.detail.value as RapportCategorie)}>
                <IonSelectOption value="Déchets">Déchets</IonSelectOption>
                <IonSelectOption value="Lumière">Lumière</IonSelectOption>
                <IonSelectOption value="Voirie">Voirie</IonSelectOption>
                <IonSelectOption value="Autre">Autre</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Adresse</IonLabel>
              <IonInput
                value={adresse}
                onIonInput={(e) => setAdresse(e.detail.value!)}
                placeholder="123 Rue Principale"
              />
            </IonItem>

            <IonItem>
              <IonLabel>Coordonnées GPS</IonLabel>
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={handleGeolocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? <IonSpinner name="crescent" /> : 'Utiliser ma position'}
              </IonButton>
            </IonItem>

            <IonItem>
              <IonLabel>
                <div>Latitude: {latitude.toFixed(6)}</div>
                <div>Longitude: {longitude.toFixed(6)}</div>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Image</IonLabel>
              <IonButton 
                slot="end" 
                fill="outline" 
                onClick={handleImageOptions}
                className="ion-margin-top"
              >
                {image ? 'Changer l\'image' : 'Ajouter une image'}
              </IonButton>
            </IonItem>

            {image && (
              <IonItem>
                <IonImg src={image} style={{ maxHeight: '200px', objectFit: 'contain' }} />
                <IonButton 
                  slot="end" 
                  fill="clear" 
                  color="danger"
                  onClick={() => setImage(undefined)}
                >
                  Supprimer
                </IonButton>
              </IonItem>
            )}

            <IonButton expand="block" onClick={handleSubmit} disabled={loading} className="ion-margin-top">
              {loading ? <IonSpinner name="crescent" /> : rapportId ? 'Modifier le rapport' : 'Enregistrer le rapport'}
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Erreur"
          message={alertMessage}
          buttons={['OK']}
        />

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Choisir une source"
          buttons={[
            {
              text: 'Prendre une photo',
              icon: camera,
              handler: () => {
                takePicture(CameraSource.Camera);
              },
            },
            {
              text: 'Choisir depuis la galerie',
              icon: images,
              handler: () => {
                takePicture(CameraSource.Photos);
              },
            },
            {
              text: 'Annuler',
              role: 'cancel',
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default CreerRapport;

