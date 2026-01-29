import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonButton,
  useIonViewWillEnter,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { create, trash } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rapportService } from '../../services/rapportService';
import { Rapport } from '../../types';
import { formatDate, getStatusColor } from '../../utils/formatters';
import ImageModal from '../../components/ImageModal';
import './MesRapports.css';

const MesRapports: React.FC = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [rapportToDelete, setRapportToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const history = useHistory();

  const loadRapports = () => {
    if (user) {
      const userRapports = rapportService.getRapportsByCitoyen(user.id);
      setRapports(userRapports.sort((a, b) => 
        new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      ));
    }
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleEdit = (rapport: Rapport) => {
    localStorage.setItem('rapport_to_edit', JSON.stringify(rapport));
    history.push('/citoyen/tabs/creer');
  };

  const handleDeleteConfirm = (rapportId: string) => {
    setRapportToDelete(rapportId);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (rapportToDelete) {
      await rapportService.deleteRapport(rapportToDelete);
    loadRapports();
      setRapportToDelete(null);
    }
  };

  useIonViewWillEnter(loadRapports);
  useEffect(() => { loadRapports(); }, [user]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadRapports();
    setTimeout(() => event.detail.complete(), 1000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mes rapports</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {rapports.length === 0 ? (
          <div className="empty-state">
            <IonCard>
              <IonCardContent>
                <p>Aucun rapport pour le moment.</p>
                <IonButton expand="block" onClick={() => history.push('/citoyen/tabs/creer')}>
                  Créer un rapport
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        ) : (
          <IonList>
            {rapports.map((rapport) => (
              <IonCard key={rapport.id}>
                <IonCardHeader>
                  <IonCardTitle>{rapport.titre}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p><strong>Description:</strong></p>
                  <p>{rapport.description}</p>
                  
                  <p><strong>Catégorie:</strong> {rapport.categorie}</p>
                  
                  <p>
                    <strong>État:</strong>{' '}
                    <IonBadge color={getStatusColor(rapport.statut)}>
                      {rapport.statut}
                    </IonBadge>
                  </p>
                  
                  <p><strong>Date de création:</strong> {formatDate(rapport.dateCreation)}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
                    {rapport.image && (
                      <IonButton 
                        expand="block" 
                        fill="outline" 
                        onClick={() => handleViewImage(rapport.image!)}
                      >
                        Voir l'image
                      </IonButton>
                    )}
                    <IonButton 
                      size="small"
                      fill="clear" 
                      color="primary"
                      onClick={() => handleEdit(rapport)}
                    >
                      <IonIcon slot="icon-only" icon={create} />
                    </IonButton>
                    <IonButton 
                      size="small"
                      fill="clear" 
                      color="danger"
                      onClick={() => handleDeleteConfirm(rapport.id)}
                    >
                      <IonIcon slot="icon-only" icon={trash} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        <ImageModal
          isOpen={showImageModal}
          imageUrl={selectedImage}
          onClose={() => setShowImageModal(false)}
        />

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce rapport?"
          buttons={[
            { text: 'Annuler', role: 'cancel' },
            { text: 'Supprimer', role: 'destructive', handler: handleDelete },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default MesRapports;

