import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
} from '@ionic/react';
import { Rapport, RapportStatus } from '../types';
import { formatDate, getStatusColor } from '../utils/formatters';

interface RapportDetailModalProps {
  isOpen: boolean;
  rapport: Rapport | null;
  onClose: () => void;
  onViewImage?: (imageUrl: string) => void;
  onStatusChange?: (status: RapportStatus) => void;
  showStatusButtons?: boolean;
}

const RapportDetailModal: React.FC<RapportDetailModalProps> = ({
  isOpen,
  rapport,
  onClose,
  onViewImage,
  onStatusChange,
  showStatusButtons = false,
}) => {
  if (!rapport) return null;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Détails du rapport</IonTitle>
          <IonButton slot="end" onClick={onClose}>Fermer</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{rapport.titre}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><strong>Description:</strong></p>
            <p>{rapport.description}</p>
            
            <p><strong>Catégorie:</strong> {rapport.categorie}</p>
            
            <p>
              <strong>Statut:</strong>{' '}
              <IonBadge color={getStatusColor(rapport.statut)}>{rapport.statut}</IonBadge>
            </p>
            
            <p><strong>Citoyen:</strong> {rapport.citoyenNom || 'Inconnu'}</p>
            
            <p><strong>Adresse:</strong> {rapport.adresse || 'Non spécifiée'}</p>
            
            <p>
              <strong>Coordonnées GPS:</strong> {rapport.latitude.toFixed(6)}, {rapport.longitude.toFixed(6)}
            </p>
            
            <p><strong>Date de création:</strong> {formatDate(rapport.dateCreation)}</p>
            
            {rapport.dateModification && (
              <p><strong>Dernière modification:</strong> {formatDate(rapport.dateModification)}</p>
            )}

            {rapport.image && onViewImage && (
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={() => onViewImage(rapport.image!)}
                style={{ marginTop: '16px' }}
              >
                Voir l'image
              </IonButton>
            )}

            {showStatusButtons && onStatusChange && (
              <div style={{ marginTop: '20px' }}>
                <IonButton 
                  expand="block" 
                  color="warning" 
                  onClick={() => onStatusChange('Ouvert')}
                  disabled={rapport.statut === 'Ouvert'}
                >
                  Marquer comme ouvert
                </IonButton>
                <IonButton 
                  expand="block" 
                  color="success" 
                  onClick={() => onStatusChange('Réparé')}
                  disabled={rapport.statut === 'Réparé'}
                  className="ion-margin-top"
                >
                  Marquer comme réparé
                </IonButton>
                <IonButton 
                  expand="block" 
                  color="medium" 
                  onClick={() => onStatusChange('Ignoré')}
                  disabled={rapport.statut === 'Ignoré'}
                  className="ion-margin-top"
                >
                  Ignorer le rapport
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default RapportDetailModal;

