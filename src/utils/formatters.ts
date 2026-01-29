// Fonctions utilitaires de formatage

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (statut: string): string => {
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

