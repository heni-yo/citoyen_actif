# Guide de Contribution - CitoyenActif

Merci de votre intérêt pour contribuer à CitoyenActif ! Ce document fournit des directives pour contribuer au projet.

## Code de Conduite

Soyez respectueux et constructif dans toutes les interactions. Nous valorisons la diversité et l'inclusion.

## Comment Contribuer

### Signaler des Bugs

Avant de créer un rapport de bug, vérifiez que le problème n'existe pas déjà. Si vous créez un nouveau rapport :

1. Utilisez un titre descriptif et clair
2. Décrivez les étapes exactes pour reproduire le problème
3. Fournissez des exemples spécifiques pour clarifier les étapes
4. Décrivez le comportement observé et ce que vous attendiez
5. Incluez des captures d'écran si possible
6. Mentionnez votre environnement (OS, navigateur, version Node.js)

### Suggérer des Améliorations

Les suggestions d'amélioration sont toujours bienvenues ! Pour suggérer une amélioration :

1. Utilisez un titre clair et descriptif
2. Fournissez une description détaillée de la suggestion
3. Listez les exemples concrets si possible
4. Mentionnez le contexte d'utilisation

### Soumettre des Pull Requests

1. **Forker le repository**
   ```bash
   git clone https://github.com/votre-username/citoyenactif.git
   cd citoyenactif
   ```

2. **Créer une branche pour votre fonctionnalité**
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalité
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

4. **Effectuer vos modifications**
   - Respectez le style de code existant
   - Utilisez des noms de variables clairs et explicites
   - Ajoutez des commentaires si nécessaire

5. **Tester vos modifications**
   ```bash
   npm run test.unit
   npm run test.e2e
   npm run lint
   ```

6. **Commiter avec un message clair en français**
   ```bash
   git commit -m "Ajouter description claire de votre changement"
   ```

7. **Pousser votre branche**
   ```bash
   git push origin feature/nom-de-la-fonctionnalité
   ```

8. **Ouvrir une Pull Request**
   - Décrivez clairement vos changements
   - Référencez les issues pertinentes avec `#numéro`
   - Vérifiez que les tests passent

## Conventions de Code

### Commits en Français

Les messages de commit doivent être en français avec les caractères spéciaux correctement encodés :

- ❌ `Add new feature for rapport creation`
- ✅ `Ajouter une nouvelle fonctionnalité de création de rapport`

### Messages de Commit

Format recommandé :

```
[Type] Brève description (50 caractères max)

Description détaillée du changement si nécessaire.

Fixes #123 (optionnel - référencer l'issue)
```

Types de commits :
- `Ajouter` - Ajout d'une nouvelle fonctionnalité
- `Corriger` - Correction d'un bug
- `Refactoriser` - Amélioration du code sans changement de fonctionnalité
- `Améliorer` - Amélioration de performance ou d'UX
- `Documenter` - Changements de documentation
- `Style` - Changements de formatage (eslint, prettier)

### Style de Code

- Utilisez TypeScript pour une meilleure sécurité des types
- Suivez les règles ESLint du projet
- Noms en camelCase pour les variables et fonctions
- Noms en PascalCase pour les composants React
- Commentaires clairs et français si pertinent

Exemple :

```typescript
// ❌ Mauvais
function crtRprt(d: any) {
  // code confus
}

// ✅ Bon
function creerRapport(donnees: CreerRapportRequest): Promise<Rapport> {
  // code clair
}
```

## Développement Local

### Installation du Projet

```bash
# Cloner et installer
git clone https://github.com/votre-username/citoyenactif.git
cd citoyenactif
npm install

# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173
```

### Structure des Dossiers

- `src/components/` - Composants React réutilisables
- `src/pages/` - Pages principales et pages spécifiques (citoyen/employe)
- `src/services/` - Services API et logique métier
- `src/context/` - Contexte React et gestion d'état
- `src/hooks/` - Hooks personnalisés
- `src/types/` - Définitions TypeScript
- `src/utils/` - Fonctions utilitaires
- `src/theme/` - Styles et variables CSS

### Tests

```bash
# Tests unitaires
npm run test.unit

# Tests E2E
npm run test.e2e

# Linting
npm run lint
```

## Processus de Review

Les pull requests seront examinées par les mainteneurs. Nous verrons :

- ✓ La qualité du code
- ✓ Les tests appropriés
- ✓ La documentation mise à jour
- ✓ Les messages de commit clairs
- ✓ Pas de conflits avec la branche principale

## Questions ?

Si vous avez des questions, veuillez :

1. Vérifier la documentation existante
2. Ouvrir une issue de discussion
3. Nous contacter via les issues du repository

## Licence

En contribuant au projet, vous acceptez que vos contributions soient licenciées sous la licence MIT du projet.

---

Merci de rendre CitoyenActif meilleur ! 🎉
