/**
 * Module de transformation des données pour le graphique hiérarchique
 * Transforme les données brutes en structure utilisable par Chart.js
 */

class DataTransformer {
    constructor() {
        this.nodePositions = new Map();
    }

    /**
     * Transforme les données brutes en structure hiérarchique
     * @param {Object} rawData - Données depuis getDataFromQuery
     * @param {number} selectedYear - Année sélectionnée
     * @returns {Object} - Structure de données pour le graphique
     */
    transformToHierarchy(rawData, selectedYear) {
        // Structure des nœuds basée sur ui_demo.png
        const nodes = [
            {
                id: 'root',
                label: '1,496',
                title: 'סה"ב משימות',
                level: 0,
                x: 50,
                y: 10,
                color: '#d6e9f5',
                borderColor: '#4479ba'
            },
            // Niveau 1 - Gauche (משימות רשות המיסים)
            {
                id: 'right-branch',
                label: '906',
                title: 'משימות רשות המיסים',
                subtitle: 'שיעור ביצוע: 77%',
                level: 1,
                x: 75,
                y: 25,
                color: '#e8e8e8',
                borderColor: '#4479ba',
                showPercentage: true,
                percentage: '77%'
            },
            // Niveau 1 - Droite (משימות בשיתוף שע"מ)
            {
                id: 'left-branch',
                label: '590',
                title: 'משימות בשיתוף שע"מ',
                subtitle: 'שיעור ביצוע: 80%',
                level: 1,
                x: 25,
                y: 25,
                color: '#e8e8e8',
                borderColor: '#4479ba',
                showPercentage: true,
                percentage: '80%'
            },

            // Niveau 2 - Branche gauche (משימות רשות המיסים)
            {
                id: 'right-new',
                label: '437',
                title: 'חדשות',
                level: 2,
                x: 65,
                y: 45,
                color: '#d2e9ab',
                borderColor: '#4479ba'
            },
            {
                id: 'right-continued',
                label: '167',
                title: 'ממשיכות',
                level: 2,
                x: 75,
                y: 45,
                color: '#ffd699',
                borderColor: '#e6a15d'
            },
            {
                id: 'right-midyear',
                label: '175',
                title: 'אמצע שנה',
                level: 2,
                x: 85,
                y: 45,
                color: '#d6e9f5',
                borderColor: '#4479ba'
            },
            {
                id: 'right-cancelled',
                label: '97',
                title: 'מבוטלות',
                level: 2,
                x: 95,
                y: 45,
                color: '#f4c2d4',
                borderColor: '#cc7d75'
            },

            // Niveau 2 - Branche droite (בשיתוף שע"מ)
            {
                id: 'left-new',
                label: '395',
                title: 'חדשות',
                level: 2,
                x: 15,
                y: 45,
                color: '#d2e9ab',
                borderColor: '#4479ba'
            },
            {
                id: 'left-continued',
                label: '73',
                title: 'ממשיכות',
                level: 2,
                x: 25,
                y: 45,
                color: '#ffd699',
                borderColor: '#e6a15d'
            },
            {
                id: 'left-midyear',
                label: '119',
                title: 'אמצע שנה',
                level: 2,
                x: 35,
                y: 45,
                color: '#d6e9f5',
                borderColor: '#4479ba'
            },

            // Niveau 3 - Sous-nœuds de "חדשות" (gauche droite - 395)
            {
                id: 'left-new-approved',
                label: '75',
                title: 'מאושר לביצוע',
                level: 3,
                x: 10,
                y: 65,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            },
            {
                id: 'left-new-converted',
                label: '286',
                title: 'הומר',
                level: 3,
                x: 15,
                y: 65,
                color: '#fff9c4',
                borderColor: '#4479ba'
            },
            {
                id: 'left-new-cancelled',
                label: '34',
                title: 'מבוטלות',
                level: 3,
                x: 20,
                y: 65,
                color: '#f4c2d4',
                borderColor: '#cc7d75'
            },

            // Niveau 3 - Sous-nœuds de "אמצע שנה" (gauche droite - 119)
            {
                id: 'left-midyear-approved',
                label: '13',
                title: 'מאושר לביצוע',
                level: 3,
                x: 30,
                y: 65,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            },
            {
                id: 'left-midyear-converted',
                label: '104',
                title: 'הומר',
                level: 3,
                x: 35,
                y: 65,
                color: '#fff9c4',
                borderColor: '#4479ba'
            },
            {
                id: 'left-midyear-cancelled',
                label: '2',
                title: 'מבוטלות',
                level: 3,
                x: 40,
                y: 65,
                color: '#f4c2d4',
                borderColor: '#cc7d75'
            },

            // Niveau 4 - Sous-nœuds de "הומר" (286)
            {
                id: 'left-new-converted-executing',
                label: '242',
                title: 'הסתיימו',
                level: 4,
                x: 15,
                y: 85,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            },

            // Niveau 4 - Sous-nœuds de "הומר" (104)
            {
                id: 'left-midyear-converted-executing',
                label: '91',
                title: 'הסתיימו',
                level: 4,
                x: 35,
                y: 85,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            }
        ];

        // Connexions entre les nœuds
        const connections = [
            // Root vers niveau 1
            { from: 'root', to: 'right-branch', label: '' },
            { from: 'root', to: 'left-branch', label: '' },

            // Branche droite (משימות רשות המיסים)
            { from: 'right-branch', to: 'right-new', label: '' },
            { from: 'right-branch', to: 'right-continued', label: '' },
            { from: 'right-branch', to: 'right-midyear', label: '' },
            { from: 'right-branch', to: 'right-cancelled', label: '' },

            // Branche gauche (בשיתוף שע"מ)
            { from: 'left-branch', to: 'left-new', label: '' },
            { from: 'left-branch', to: 'left-continued', label: '' },
            { from: 'left-branch', to: 'left-midyear', label: '' },

            // Sous-nœuds de "חדשות" (395)
            { from: 'left-new', to: 'left-new-approved', label: '' },
            { from: 'left-new', to: 'left-new-converted', label: '' },
            { from: 'left-new', to: 'left-new-cancelled', label: '' },

            // Sous-nœuds de "אמצע שנה" (119)
            { from: 'left-midyear', to: 'left-midyear-approved', label: '' },
            { from: 'left-midyear', to: 'left-midyear-converted', label: '' },
            { from: 'left-midyear', to: 'left-midyear-cancelled', label: '' },

            // Niveau 4
            { from: 'left-new-converted', to: 'left-new-converted-executing', label: '' },
            { from: 'left-midyear-converted', to: 'left-midyear-converted-executing', label: '' }
        ];

        return { nodes, connections };
    }

    /**
     * Calcule un pourcentage moyen
     * @param {Array} values - Tableau de valeurs
     * @returns {string} - Pourcentage formaté
     */
    calculateAverage(values) {
        if (!values || values.length === 0) return '0%';
        const sum = values.reduce((acc, val) => acc + Number(val), 0);
        const avg = (sum / values.length) * 100;
        return avg.toFixed(2) + '%';
    }

    /**
     * Filtre les données par année
     * @param {Array} data - Données brutes
     * @param {number} year - Année à filtrer
     * @returns {Array} - Données filtrées
     */
    filterByYear(data, year) {
        if (!data || !Array.isArray(data)) return [];
        return data.filter(item => {
            const itemYear = new Date(item.start || item.created).getFullYear();
            return itemYear === year;
        });
    }
}

// Export pour utilisation dans d'autres modules
window.DataTransformer = DataTransformer;
