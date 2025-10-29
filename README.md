# Graphique Hiérarchique - Rשות המיסים

Application de visualisation de données hiérarchiques avec Chart.js

## Architecture du Projet

```
TX/
├── hierarchy-chart.html          # Point d'entrée HTML
├── getDataFromQuery.js           # Récupération des données depuis le serveur
├── src/
│   ├── main.js                   # Orchestration principale
│   ├── charts/
│   │   └── hierarchicalChart.js  # Rendu du graphique hiérarchique
│   ├── data/
│   │   └── dataTransformer.js    # Transformation des données
│   └── utils/
│       └── chartConfig.js        # Configuration commune
└── styles/
    └── chart.css                 # Styles CSS
```

## Modules

### 1. `main.js` - Point d'entrée principal
- Initialise l'application
- Orchestre le flux de données
- Gère les événements (changement d'année, redimensionnement)
- Expose des API publiques (`updateChart`, `refreshChart`)

### 2. `hierarchicalChart.js` - Moteur de rendu
- Utilise Chart.js (type scatter)
- Dessine les connexions entre nœuds
- Gère les badges de pourcentage
- Supporte l'animation et l'interactivité

### 3. `dataTransformer.js` - Transformation des données
- Convertit les données brutes en structure hiérarchique
- Calcule les statistiques (moyennes, pourcentages)
- Filtre par année

### 4. `chartConfig.js` - Configuration
- Couleurs des nœuds
- Polices et styles
- Configuration Chart.js par défaut

### 5. `getDataFromQuery.js` - Récupération des données
- Exécute les requêtes XOG
- Convertit XML en JSON
- **Réutilisé du code existant**

## Utilisation

### Démarrage
Ouvrez simplement `hierarchy-chart.html` dans un navigateur.

### Intégration avec des données réelles

Dans [src/main.js](src/main.js), décommentez les lignes suivantes :

```javascript
const url = window.document.URL;
const serverName = url.substring(0, url.indexOf("niku/") - 1);
const filters = { year: selectedYear };
rawData = ExecuteClarityQuery("dash_rashut_pm", serverName, filters);
```

### API Publique

```javascript
// Mettre à jour avec une année spécifique
window.updateChart(2026);

// Rafraîchir le graphique
window.refreshChart();
```

### Événements personnalisés

```javascript
// Écouter les changements de filtre
document.addEventListener('filterSelected', function(event) {
    const year = event.detail.year;
    // ...
});
```

## Ajout de nouveaux graphiques

Pour ajouter un nouveau type de graphique :

1. Créez un nouveau fichier dans `src/charts/` (ex: `barChart.js`)
2. Créez une classe similaire à `HierarchicalChart`
3. Ajoutez le script dans le HTML
4. Utilisez-le dans `main.js`

Exemple :

```javascript
// src/charts/barChart.js
class BarChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        // ...
    }

    render(data) {
        // Logique de rendu
    }
}

window.BarChart = BarChart;
```

## Dépendances

- **Chart.js 3.9.1** - Bibliothèque de graphiques
- **chartjs-plugin-datalabels** - Plugin pour les labels
- **getDataFromQuery.js** - Module existant pour les requêtes

## Personnalisation

### Couleurs
Modifiez [src/utils/chartConfig.js](src/utils/chartConfig.js) :

```javascript
colors: {
    new: {
        background: '#d2e9ab',
        border: '#4479ba'
    },
    // ...
}
```

### Styles
Modifiez [styles/chart.css](styles/chart.css)

### Positions des nœuds
Modifiez les coordonnées `x` et `y` dans [src/data/dataTransformer.js](src/data/dataTransformer.js)

## Structure des données

### Format d'entrée (depuis getDataFromQuery)
```javascript
[
    {
        common_shaam: 'true',
        apro_start_year: 2025,
        statut_idea_changeme: '4',
        status: '8',
        start: '2025-01-01',
        // ...
    }
]
```

### Format de sortie (hiérarchie)
```javascript
{
    nodes: [
        {
            id: 'root',
            label: '1,496',
            title: 'סה"ב משימות',
            level: 0,
            x: 50,
            y: 10,
            color: '#d6e9f5',
            borderColor: '#4479ba'
        }
    ],
    connections: [
        { from: 'root', to: 'right-branch', label: '' }
    ]
}
```

## Performance

- Les graphiques sont optimisés avec Canvas
- Animation smooth de 800ms
- Redimensionnement avec debounce (250ms)

## Extensibilité

L'architecture modulaire permet d'ajouter facilement :
- ✅ Nouveaux types de graphiques (dans `src/charts/`)
- ✅ Nouveaux transformateurs de données (dans `src/data/`)
- ✅ Nouvelles configurations (dans `src/utils/`)
- ✅ Filtres et interactions personnalisés

## Support

Pour toute question, consultez la documentation de Chart.js :
https://www.chartjs.org/docs/latest/
