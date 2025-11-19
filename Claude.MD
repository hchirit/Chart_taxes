# Claude.MD - Guide du Projet TX Dashboard

## Vue d'ensemble du projet

**Nom**: Dashboard  - רשות המיסים (Autorité fiscale israélienne)

**Objectif principal**: Application web de visualisation de données  pour afficher et analyser les statistiques de projets et tâches de l'autorité fiscale israélienne.

## Architecture et Principes de Base

### 1. Architecture Modulaire
Le projet suit une architecture modulaire stricte :

```
TX/
├── index.html                    # Point d'entrée principal
├── src/
│   ├── main.js                   # Orchestration principale
│   ├── charts/                   # Tous les graphiques
│   │   └── hierarchicalChart.js  # Chart hiérarchique actuel
│   ├── data/
│   │   └── dataTransformer.js    # Transformation des données
│   ├── filters/
│   │   └── filterManager.js      # Gestion centralisée des filtres
│   └── utils/
│       └── chartConfig.js        # Configuration commune
├── styles/
│   └── chart.css                 # Styles CSS
├── getDataFromQuery.js           # Récupération depuis serveur
├── filtersConfig.js              # Configuration des filtres
└── filter.js                     # Logique des filtres
```

### 2. Système de Filtres Unifié

**CRITÈRE CRUCIAL**: Les filtres doivent affecter TOUS les graphiques de la page.

#### Filtres disponibles :
- **Année** (yearFilter) - Filtre principal
- **OBS** (obsFilter) - Organisation
- **Mises à jour de tâches** (taskUpdatesFilter)
- **Responsable** (responsibleFilter)

#### Mécanisme :
1. Le `FilterManager` (src/filters/filterManager.js) centralise la gestion des filtres
2. Lorsqu'un filtre change, un événement `filtersChanged` est dispatché
3. Tous les graphiques écoutent cet événement et se rafraîchissent
4. L'événement `filterSelected` est utilisé pour les changements individuels

```javascript
// Exemple d'écoute des filtres dans un nouveau chart
document.addEventListener('filtersChanged', function(event) {
    const filters = event.detail.filters;
    // Rafraîchir le graphique avec les nouveaux filtres
});
```

### 3. Système Multi-Graphiques

**VISION FUTURE**: La page doit supporter plusieurs graphiques simultanément.

#### Principes pour ajouter un nouveau graphique :

1. **Créer le fichier du graphique** dans `src/charts/`
   ```javascript
   // Exemple: src/charts/barChart.js
   class BarChart {
       constructor(canvasId) {
           this.canvas = document.getElementById(canvasId);
           this.chart = null;
       }

       render(data) {
           // Logique de rendu
       }

       destroy() {
           if (this.chart) this.chart.destroy();
       }
   }
   window.BarChart = BarChart;
   ```

2. **Ajouter le canvas dans index.html**
   ```html
   <div class="chart-container">
       <canvas id="barChart"></canvas>
   </div>
   ```

3. **Initialiser dans main.js**
   ```javascript
   let barChart = new BarChart('barChart');
   barChart.render(transformedData);
   ```

4. **Écouter les événements de filtres**
   ```javascript
   document.addEventListener('filtersChanged', function(event) {
       barChart.render(getFilteredData(event.detail.filters));
   });
   ```

### 4. Système de Badges

Les badges en haut de la page affichent des statistiques calculées dynamiquement :

- **Badge Primaire** : Biצוע כללי (Exécution générale)
- **Badge Secondaire** : Biצוע פרויקטים שהומרו (Exécution projets convertis)
- **Badge Tertiaire** : Biצוع שנתי (Exécution annuelle)
- **Badge Quaternaire** : Biצוע שלישוני (Exécution trimestrielle)

Ces badges sont mis à jour par `updateHeaderBadges()` dans main.js.

## Technologies Utilisées

### Bibliothèques :
- **Chart.js 3.9.1** - Rendu des graphiques
- **chartjs-plugin-datalabels** - Labels sur les graphiques
- **getDataFromQuery.js** - Requêtes XOG vers le serveur

### Langages :
- JavaScript (ES6+) avec classes
- HTML5 + CSS3
- Hébreu (direction RTL)

## Flux de Données

1. **Récupération** : `getDataFromQuery.js` → Serveur XOG
2. **Stockage** : Variable globale `allIdea` (data.js)
3. **Transformation** : `DataTransformer.transformToHierarchy()`
4. **Filtrage** : `FilterManager` applique les filtres
5. **Rendu** : Chaque graphique reçoit les données filtrées
6. **Mise à jour** : Événements personnalisés pour synchroniser

## Conventions de Code

### 1. Nomenclature
- **Classes** : PascalCase (ex: `HierarchicalChart`, `FilterManager`)
- **Fonctions** : camelCase (ex: `renderChart`, `loadData`)
- **Constantes** : camelCase pour les variables (ex: `selectedYear`)
- **IDs HTML** : camelCase (ex: `yearFilter`, `hierarchyChart`)

### 2. Structure des Classes
Chaque graphique doit avoir :
- Constructeur avec `canvasId`
- Méthode `render(data)`
- Méthode `destroy()` pour nettoyer
- Propriété `this.chart` pour l'instance Chart.js

### 3. Événements Personnalisés
- `filterSelected` : Changement d'un filtre individuel
- `filtersChanged` : Changement de tous les filtres
- Toujours inclure les données dans `event.detail`

### 4. Gestion des Erreurs
- Try-catch dans toutes les fonctions principales
- Logs console pour le debugging
- Affichage des erreurs à l'utilisateur via `showError()`

## Principes de Développement

### 1. Modularité
- Un fichier = Une responsabilité
- Classes réutilisables
- Couplage faible entre modules

### 2. Extensibilité
- Facile d'ajouter de nouveaux graphiques
- Facile d'ajouter de nouveaux filtres
- Configuration centralisée

### 3. Performance
- Debounce sur le resize (250ms)
- Animation smooth (800ms)
- Destruction des graphiques avant recréation

### 4. Support Multilingue
- Interface en hébreu (RTL)
- Support des caractères hébraïques
- Direction `dir="rtl"` sur `<html>`

## Roadmap et Évolutions Futures

### Phase 1 : Multi-Charts (Prioritaire)
- [ ] Ajouter un graphique en barres pour les statistiques par OBS
- [ ] Layout grid responsive pour organiser les graphiques
- [ ] Les filtres doivent rafraîchir TOUS les graphiques simultanément

### Phase 2 : Filtres Avancés
- [ ] Peupler dynamiquement les filtres depuis les données
- [ ] Ajouter des filtres de date (début/fin)
- [ ] Ajouter un bouton "Réinitialiser les filtres"
- [ ] Sauvegarder les filtres dans localStorage

### Phase 3 : Interactivité
- [ ] Clic sur un nœud pour afficher les détails
- [ ] Drill-down dans les données
- [ ] Export des graphiques en image
- [ ] Export des données en Excel

### Phase 4 : Performance et UX
- [ ] Lazy loading des graphiques
- [ ] Skeleton loaders pendant le chargement
- [ ] Animations entre les transitions de filtres
- [ ] Mode sombre / clair

## Points d'Attention Critiques

### 🔴 TOUJOURS RESPECTER :

1. **Filtres universels** : Tout filtre doit affecter tous les graphiques
2. **Architecture modulaire** : Ne pas mélanger les responsabilités
3. **Support RTL** : Interface en hébreu uniquement
4. **Compatibilité** : Tester avec les données réelles du serveur
5. **Performance** : Optimiser pour de grandes quantités de données

### 🟡 CONVENTIONS À SUIVRE :

1. Commenter en français (ou anglais) dans le code
2. Labels UI en hébreu
3. Console logs pour le debugging
4. Toujours tester avec plusieurs filtres actifs
5. Vérifier la responsivité sur différents écrans

### 🟢 BONNES PRATIQUES :

1. Utiliser Chart.js pour tous les graphiques
2. Centraliser la configuration dans `chartConfig.js`
3. Réutiliser `DataTransformer` pour toutes les transformations
4. Garder `main.js` comme orchestrateur principal
5. Exposer les API publiques via `window.nomFonction`

## API Publiques Disponibles

```javascript
// Mettre à jour l'année affichée
window.updateChart(2026);

// Rafraîchir tous les graphiques
window.refreshChart();

// Mettre à jour les badges manuellement
window.updateBadges({
    primary: 85,
    secondary: 92,
    tertiary: 78,
    quaternary: 88
});

// Accéder au gestionnaire de filtres
filterManager.getActiveFilters();
filterManager.resetFilters();
filterManager.populateFilter('obsFilter', [
    { value: 'obs1', label: 'OBS 1' },
    { value: 'obs2', label: 'OBS 2' }
]);
```

## Intégration avec Clarity PPM

Le projet s'intègre avec Clarity PPM (serveur XOG) :

```javascript
// Récupération des données
const url = window.document.URL;
const serverName = url.substring(0, url.indexOf("niku/") - 1);
const filters = { year: selectedYear };
rawData = ExecuteClarityQuery("dash_rashut_pm", serverName, filters);
```

**Requêtes disponibles** :
- `dash_rashut_pm` : Données principales du dashboard
- `obs_gitty` : Liste des OBS disponibles

## Format des Données

### Entrée (depuis le serveur) :
```javascript
[
    {
        common_shaam: 'true',
        apro_start_year: 2025,
        statut_idea_changeme: '4',
        status: '8',
        start: '2025-01-01',
        // ... autres champs
    }
]
```

### Sortie (après transformation) :
```javascript
{
    nodes: [
        {
            id: 'root',
            label: '1,496',
            title: 'סה"כ משימות',
            level: 0,
            x: 50,
            y: 10,
            color: '#d6e9f5',
            borderColor: '#4479ba'
        }
    ],
    connections: [
        { from: 'root', to: 'child', label: '95%' }
    ]
}
```

## Notes pour Claude

Lorsque tu travailles sur ce projet :

1. **Toujours consulter ce fichier** avant de proposer des modifications
2. **Respecter l'architecture modulaire** existante
3. **Tester les filtres** sur tous les graphiques
4. **Maintenir la compatibilité** avec le code existant
5. **Documenter les nouvelles fonctionnalités** dans ce fichier

Si tu ajoutes un nouveau graphique, pense à :
- Créer la classe dans `src/charts/`
- L'initialiser dans `main.js`
- Connecter les filtres
- Mettre à jour ce fichier

---

**Dernière mise à jour** : 2025-11-17
**Version** : 2.0 (Architecture modulaire stable)
**Statut** : En développement actif
