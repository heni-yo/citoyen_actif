import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  useIonViewWillEnter,
  IonButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { logOut } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { rapportService } from '../../services/rapportService';
import { Rapport } from '../../types';
import { useRapportModal } from '../../hooks/useRapportModal';
import RapportDetailModal from '../../components/RapportDetailModal';
import ImageModal from '../../components/ImageModal';
import './CarteRapportsEmploye.css';

// Fix icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CarteRapportsEmploye: React.FC = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const history = useHistory();
  const { logout } = useAuth();

  const loadRapports = () => {
    const allRapports = rapportService.getAllRapports();
    setRapports(allRapports);
  };

  const modalState = useRapportModal(loadRapports);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  useIonViewWillEnter(() => {
    loadRapports();
  });

  useEffect(() => {
    loadRapports();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const timer = setTimeout(() => {
        if (mapContainerRef.current && !mapRef.current) {
          mapRef.current = L.map(mapContainerRef.current).setView([45.5017, -73.5673], 12);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);

          setTimeout(() => {
            mapRef.current?.invalidateSize();
          }, 200);
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    if (mapRef.current && rapports.length > 0) {
      markersRef.current.forEach(marker => {
        mapRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      rapports.forEach((rapport) => {
        const getMarkerColor = (statut: string) => {
          switch (statut) {
            case 'Ouvert':
              return 'orange';
            case 'Réparé':
              return 'green';
            case 'Ignoré':
              return 'gray';
            default:
              return 'blue';
          }
        };

        const marker = L.marker([rapport.latitude, rapport.longitude])
          .addTo(mapRef.current!)
          .bindPopup(
            `<b>${rapport.titre}</b><br/>${rapport.description}<br/>Catégorie: ${rapport.categorie}<br/>Statut: ${rapport.statut}<br/>Citoyen: ${rapport.citoyenNom || 'Inconnu'}`
          );

        marker.on('click', () => modalState.handleViewDetails(rapport));
        markersRef.current.push(marker);
      });

      if (rapports.length > 0) {
        const group = new L.FeatureGroup(markersRef.current.map(m => m));
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [rapports, modalState]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Carte des rapports</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {rapports.length === 0 ? (
          <div className="empty-state">
            <IonCard>
              <IonCardContent>
                <p>Aucun rapport pour le moment.</p>
              </IonCardContent>
            </IonCard>
          </div>
        ) : (
          <div ref={mapContainerRef} className="map-container" />
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

export default CarteRapportsEmploye;
