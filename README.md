# CitoyenActif 🌍

Plateforme mobile et web pour signaler, consulter et gérer les rapports de problèmes civiques et environnementaux.

## Description

**CitoyenActif** est une application intuitive qui permet aux citoyens et aux employés de collaborer pour améliorer leur communauté. Les utilisateurs peuvent créer des rapports détaillés avec localisation GPS, photos et descriptions pour signaler des problèmes. Les employés peuvent consulter, analyser et gérer ces rapports via une interface dédiée.

### Fonctionnalités principales

- 👤 **Authentification sécurisée** : inscription et connexion pour citoyens et employés
- 📍 **Localisation GPS** : capture automatique de la position du signalement
- 📸 **Gestion des photos** : ajout d'images pour documenter les problèmes
- 🗺️ **Carte interactive** : visualisation des rapports sur une carte Leaflet
- 📊 **Tableau de bord** : suivi des rapports créés et reçus
- 👥 **Rôles différenciés** : interfaces adaptées pour citoyens et employés

## Stack technologique

- **Frontend** : React 19 + TypeScript + Vite
- **Mobile** : Ionic + Capacitor (Android, iOS)
- **UI** : Ionic Components
- **Cartographie** : Leaflet + React Leaflet
- **Routing** : React Router v5
- **Tests** : Vitest + Cypress
- **Linting** : ESLint

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Git

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/yourusername/citoyenactif.git
   cd citoyenactif
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   - L'application sera accessible à `http://localhost:5173`

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le serveur de développement |
| `npm run build` | Compiler le projet pour la production |
| `npm run preview` | Aperçu de la build de production |
| `npm run test.unit` | Exécuter les tests unitaires |
| `npm run test.e2e` | Exécuter les tests end-to-end |
| `npm run lint` | Vérifier la qualité du code |

## Structure du projet

```
src/
├── components/       # Composants React réutilisables
├── pages/           # Pages principales de l'application
│   ├── citoyen/     # Interface pour les citoyens
│   └── employe/     # Interface pour les employés
├── services/        # Services API (auth, rapports)
├── context/         # Context API pour la gestion d'état
├── hooks/           # Hooks personnalisés
├── types/           # Définitions TypeScript
├── utils/           # Fonctions utilitaires
└── theme/           # Styles et variables CSS
```

## Utilisation

### Pour les citoyens

1. Créer un compte ou se connecter
2. Accéder à la carte interactive
3. Cliquer sur "Créer un rapport" pour signaler un problème
4. Ajouter localisation, photos et description
5. Soumettre le rapport

### Pour les employés

1. Se connecter avec un compte employé
2. Consulter tous les rapports reçus
3. Analyser les rapports par localisation
4. Mettre à jour le statut des rapports

## Tests

### Tests unitaires
```bash
npm run test.unit
```

### Tests E2E
```bash
npm run test.e2e
```

## Build Android

```bash
npm run build
npx cap build android
```

## Contribution

Les contributions sont bienvenues ! Veuillez :

1. Fork le repository
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements en français (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteur

Créé avec ❤️ pour améliorer notre communauté.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

---

**Dernière mise à jour** : Janvier 2026
