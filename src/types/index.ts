export type UserRole = 'citoyen' | 'employe';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  courriel: string;
  role: UserRole;
  photoProfil?: string;
}

export type RapportStatus = 'Ouvert' | 'Réparé' | 'Ignoré';

export type RapportCategorie = 'Déchets' | 'Lumière' | 'Voirie' | 'Autre';

export interface Rapport {
  id: string;
  titre: string;
  description: string;
  categorie: RapportCategorie;
  latitude: number;
  longitude: number;
  adresse?: string;
  image?: string; // Base64 ou URL
  statut: RapportStatus;
  citoyenId: string;
  citoyenNom?: string;
  dateCreation: string;
  dateModification?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (courriel: string, password: string, role: UserRole) => Promise<boolean>;
  register: (nom: string, prenom: string, courriel: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

