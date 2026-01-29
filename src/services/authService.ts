import { User, UserRole } from '../types';

const STORAGE_KEY_USERS = 'citoyen_actif_users';
const STORAGE_KEY_CURRENT_USER = 'citoyen_actif_current_user';

export const authService = {
  async register(nom: string, prenom: string, courriel: string, password: string): Promise<boolean> {
    try {
      const users = this.getAllUsers();
      
      if (users.find(u => u.courriel === courriel)) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      const newUser: User = {
        id: Date.now().toString(),
        nom,
        prenom,
        courriel,
        role: 'citoyen',
      };

      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword as any);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    }
  },

  async login(courriel: string, password: string, role: UserRole): Promise<User | null> {
    try {
      const users = this.getAllUsers();
      const user = users.find((u: any) => 
        u.courriel === courriel && 
        u.password === password && 
        u.role === role
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(userWithoutPassword));
        return userWithoutPassword as User;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getAllUsers(): any[] {
    try {
      const usersStr = localStorage.getItem(STORAGE_KEY_USERS);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch {
      return [];
    }
  },

  createDefaultEmploye(): void {
    const users = this.getAllUsers();
    if (!users.find((u: any) => u.courriel === 'employe@municipalite.ca')) {
      users.push({
        id: 'employe-1',
        nom: 'Municipal',
        prenom: 'Employé',
        courriel: 'employe@municipalite.ca',
        password: 'employe123',
        role: 'employe'
      });
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }
  }
};

authService.createDefaultEmploye();

