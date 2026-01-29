import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonModal,
  IonButton,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  useIonViewWillEnter,
} from '@ionic/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { rapportService } from '../../services/rapportService';
import { Rapport } from '../../types';
import './CarteRapports.css';

// Fix pour les icônes de marqueurs Leaflet
// Utiliser les URLs directes pour éviter les problèmes avec Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CarteRapports: React.FC = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Recharger les rapports à chaque fois que la page devient active
  useIonViewWillEnter(() => {
    loadRapports();
  });

  useEffect(() => {
    loadRapports();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Petit délai pour s'assurer que le conteneur est bien rendu
      const timer = setTimeout(() => {
        if (mapContainerRef.current && !mapRef.current) {
          // Initialiser la carte centrée sur Montréal
          mapRef.current = L.map(mapContainerRef.current).setView([45.5017, -73.5673], 12);

          // Ajouter la couche de tuiles OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);

          // Forcer le redimensionnement de la carte après un court délai
          setTimeout(() => {
            mapRef.current?.invalidateSize();
          }, 200);
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Mettre à jour les marqueurs quand les rapports changent
    if (mapRef.current && rapports.length > 0) {
      // Supprimer les anciens marqueurs
      markersRef.current.forEach(marker => {
        mapRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      // Ajouter les nouveaux marqueurs
      rapports.forEach((rapport) => {
        const marker = L.marker([rapport.latitude, rapport.longitude])
          .addTo(mapRef.current!)
          .bindPopup(
            `<b>${rapport.titre}</b><br/>${rapport.categorie}<br/>${rapport.statut}`
          );

        marker.on('click', () => {
          setSelectedRapport(rapport);
          setShowModal(true);
        });

        markersRef.current.push(marker);
      });

      // Ajuster la vue pour afficher tous les marqueurs
      if (rapports.length > 0) {
        const group = new L.FeatureGroup(markersRef.current.map(m => m));
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    return () => {
      // Nettoyage
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [rapports]);

  const loadRapports = () => {
    const allRapports = rapportService.getAllRapports();
    setRapports(allRapports);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Ouvert':
        return 'warning';
      case 'Réparé':
        return 'success';
      case 'Ignoré':
        return 'medium';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Carte des rapports</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div ref={mapContainerRef} className="map-container" />

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Détails du rapport</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>Fermer</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedRapport && (
              <IonCard>
                {selectedRapport.image && (
                  <img src={selectedRapport.image} alt="Rapport" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                )}
                <IonCardHeader>
                  <IonCardTitle>{selectedRapport.titre}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p><strong>Description:</strong> {selectedRapport.description}</p>
                  <p><strong>Catégorie:</strong> {selectedRapport.categorie}</p>
                  <p><strong>Statut:</strong> <IonBadge color={getStatusColor(selectedRapport.statut)}>{selectedRapport.statut}</IonBadge></p>
                  <p><strong>Adresse:</strong> {selectedRapport.adresse || 'Non spécifiée'}</p>
                  <p><strong>Coordonnées:</strong> {selectedRapport.latitude.toFixed(6)}, {selectedRapport.longitude.toFixed(6)}</p>
                  <p><strong>Date de création:</strong> {formatDate(selectedRapport.dateCreation)}</p>
                </IonCardContent>
              </IonCard>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CarteRapports;
