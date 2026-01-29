import { useState } from 'react';
import { Rapport, RapportStatus } from '../types';
import { rapportService } from '../services/rapportService';

export const useRapportModal = (onUpdate?: () => void) => {
  const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleViewDetails = (rapport: Rapport) => {
    setSelectedRapport(rapport);
    setShowModal(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleStatusChange = async (newStatus: RapportStatus) => {
    if (!selectedRapport) return;

    const success = await rapportService.updateRapportStatus(selectedRapport.id, newStatus);
    if (success) {
      setAlertMessage(`Le statut a été changé à "${newStatus}"`);
      setShowAlert(true);
      setShowModal(false);
      setSelectedRapport(null);
      if (onUpdate) onUpdate();
    } else {
      setAlertMessage('Erreur lors de la mise à jour du statut');
      setShowAlert(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRapport(null);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return {
    selectedRapport,
    showModal,
    showImageModal,
    selectedImage,
    showAlert,
    alertMessage,
    handleViewDetails,
    handleViewImage,
    handleStatusChange,
    closeModal,
    closeImageModal,
    setShowAlert,
  };
};

