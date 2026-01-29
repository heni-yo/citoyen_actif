import { Rapport, RapportStatus, RapportCategorie } from '../types';

const STORAGE_KEY_RAPPORTS = 'citoyen_actif_rapports';

export const rapportService = {
  async createRapport(
    titre: string,
    description: string,
    categorie: RapportCategorie,
    latitude: number,
    longitude: number,
    adresse: string,
    image: string | undefined,
    citoyenId: string,
    citoyenNom: string
  ): Promise<Rapport> {
    const rapports = this.getAllRapports();
    
    const newRapport: Rapport = {
      id: Date.now().toString(),
      titre,
      description,
      categorie,
      latitude,
      longitude,
      adresse,
      image,
      statut: 'Ouvert',
      citoyenId,
      citoyenNom,
      dateCreation: new Date().toISOString(),
    };

    rapports.push(newRapport);
    localStorage.setItem(STORAGE_KEY_RAPPORTS, JSON.stringify(rapports));

    return newRapport;
  },

  getAllRapports(): Rapport[] {
    try {
      const rapportsStr = localStorage.getItem(STORAGE_KEY_RAPPORTS);
      return rapportsStr ? JSON.parse(rapportsStr) : [];
    } catch {
      return [];
    }
  },

  getRapportsByCitoyen(citoyenId: string): Rapport[] {
    const rapports = this.getAllRapports();
    return rapports.filter(r => r.citoyenId === citoyenId);
  },

  getRapportById(id: string): Rapport | undefined {
    const rapports = this.getAllRapports();
    return rapports.find(r => r.id === id);
  },

  async updateRapportStatus(id: string, statut: RapportStatus): Promise<boolean> {
    try {
      const rapports = this.getAllRapports();
      const rapport = rapports.find(r => r.id === id);
      
      if (rapport) {
        rapport.statut = statut;
        rapport.dateModification = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY_RAPPORTS, JSON.stringify(rapports));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport:', error);
      return false;
    }
  },

  async deleteRapport(id: string): Promise<boolean> {
    try {
      const rapports = this.getAllRapports();
      const filteredRapports = rapports.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY_RAPPORTS, JSON.stringify(filteredRapports));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du rapport:', error);
      return false;
    }
  },

  async updateRapport(
    id: string,
    titre: string,
    description: string,
    categorie: RapportCategorie,
    latitude: number,
    longitude: number,
    adresse: string,
    image: string | undefined
  ): Promise<boolean> {
    try {
      const rapports = this.getAllRapports();
      const rapport = rapports.find(r => r.id === id);
      
      if (rapport) {
        rapport.titre = titre;
        rapport.description = description;
        rapport.categorie = categorie;
        rapport.latitude = latitude;
        rapport.longitude = longitude;
        rapport.adresse = adresse;
        rapport.image = image;
        rapport.dateModification = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY_RAPPORTS, JSON.stringify(rapports));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport:', error);
      return false;
    }
  },

  filterRapports(
    rapports: Rapport[],
    statut?: RapportStatus,
    categorie?: RapportCategorie,
    dateDebut?: string,
    dateFin?: string
  ): Rapport[] {
    let filtered = [...rapports];

    if (statut) {
      filtered = filtered.filter(r => r.statut === statut);
    }

    if (categorie) {
      filtered = filtered.filter(r => r.categorie === categorie);
    }

    if (dateDebut) {
      filtered = filtered.filter(r => r.dateCreation >= dateDebut);
    }

    if (dateFin) {
      filtered = filtered.filter(r => r.dateCreation <= dateFin);
    }

    return filtered;
  }
};

