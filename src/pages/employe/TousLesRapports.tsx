import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { logOut } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rapportService } from '../../services/rapportService';
import { Rapport, RapportStatus, RapportCategorie } from '../../types';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { useRapportModal } from '../../hooks/useRapportModal';
import RapportDetailModal from '../../components/RapportDetailModal';
import ImageModal from '../../components/ImageModal';
import './TousLesRapports.css';

const TousLesRapports: React.FC = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [filteredRapports, setFilteredRapports] = useState<Rapport[]>([]);
  const [statutFilter, setStatutFilter] = useState<RapportStatus | ''>('');
  const [categorieFilter, setCategorieFilter] = useState<RapportCategorie | ''>('');
  const history = useHistory();
  const { logout } = useAuth();

  const loadRapports = () => {
    const allRapports = rapportService.getAllRapports();
    setRapports(allRapports.sort((a, b) => 
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    ));
  };

  const modalState = useRapportModal(loadRapports);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  useEffect(() => {
    loadRapports();
  }, []);

  useEffect(() => {
    const filtered = rapportService.filterRapports(
      rapports,
      statutFilter || undefined,
      categorieFilter || undefined
    );
    setFilteredRapports(filtered);
  }, [rapports, statutFilter, categorieFilter]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadRapports();
    setTimeout(() => event.detail.complete(), 1000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tous les rapports</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Filtrer par statut</IonLabel>
              <IonSelect
                value={statutFilter}
                onIonChange={(e) => setStatutFilter(e.detail.value as RapportStatus | '')}
                placeholder="Tous les statuts"
              >
                <IonSelectOption value="">Tous</IonSelectOption>
                <IonSelectOption value="Ouvert">Ouvert</IonSelectOption>
                <IonSelectOption value="Réparé">Réparé</IonSelectOption>
                <IonSelectOption value="Ignoré">Ignoré</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Filtrer par catégorie</IonLabel>
              <IonSelect
                value={categorieFilter}
                onIonChange={(e) => setCategorieFilter(e.detail.value as RapportCategorie | '')}
                placeholder="Toutes les catégories"
              >
                <IonSelectOption value="">Toutes</IonSelectOption>
                <IonSelectOption value="Déchets">Déchets</IonSelectOption>
                <IonSelectOption value="Lumière">Lumière</IonSelectOption>
                <IonSelectOption value="Voirie">Voirie</IonSelectOption>
                <IonSelectOption value="Autre">Autre</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {filteredRapports.length === 0 ? (
          <div className="empty-state">
            <IonCard>
              <IonCardContent>
                <p>Aucun rapport trouvé.</p>
              </IonCardContent>
            </IonCard>
          </div>
        ) : (
          <IonList>
            {filteredRapports.map((rapport) => (
              <IonCard key={rapport.id} onClick={() => modalState.handleViewDetails(rapport)} button>
                <IonCardHeader>
                  <IonCardTitle>{rapport.titre}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p><strong>Description:</strong> {rapport.description}</p>
                  <IonItem lines="none">
                    <IonLabel>
                      <p>Catégorie: {rapport.categorie}</p>
                      <p>Citoyen: {rapport.citoyenNom || 'Inconnu'}</p>
                      <p>Date: {formatDate(rapport.dateCreation)}</p>
                      {rapport.adresse && <p>Adresse: {rapport.adresse}</p>}
                    </IonLabel>
                    <IonBadge color={getStatusColor(rapport.statut)} slot="end">
                      {rapport.statut}
                    </IonBadge>
                  </IonItem>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        <RapportDetailModal
          isOpen={modalState.showModal}
          rapport={modalState.selectedRapport}
          onClose={modalState.closeModal}
          onViewImage={modalState.handleViewImage}
          onStatusChange={modalState.handleStatusChange}
          showStatusButtons={true}
        />

        <ImageModal
          isOpen={modalState.showImageModal}
          imageUrl={modalState.selectedImage}
          onClose={modalState.closeImageModal}
        />

        <IonAlert
          isOpen={modalState.showAlert}
          onDidDismiss={() => modalState.setShowAlert(false)}
          header="Information"
          message={modalState.alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default TousLesRapports;

