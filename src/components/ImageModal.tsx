import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonImg,
} from '@ionic/react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Image du rapport</IonTitle>
          <IonButton slot="end" onClick={onClose}>Fermer</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {imageUrl && <IonImg src={imageUrl} />}
      </IonContent>
    </IonModal>
  );
};

export default ImageModal;

