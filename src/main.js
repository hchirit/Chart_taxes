/**
 * Point d'entrée principal de l'application
 * Orchestre l'initialisation et la mise à jour du graphique
 */

(function() {
    'use strict';

    // Variables globales
    let hierarchyChart = null;
    let dataTransformer = null;
    let selectedYear = 2025;
    let rawData = null;

    /**
     * Initialise l'application
     */
    function init() {
        console.log('Initialisation de l\'application...');

        // Crée les instances des modules
        dataTransformer = new DataTransformer();
        hierarchyChart = new HierarchicalChart('hierarchyChart');

        // Charge les données
        loadData();

        // Configure les événements
        setupEventListeners();
    }

    /**
     * Charge les données depuis getDataFromQuery
     */
    function loadData() {
        try {
            // Récupère les données depuis le serveur
            // Utilise la fonction ExecuteClarityQuery de getDataFromQuery.js

            // Pour la démo, utilise des données de test
            // Dans la vraie application, décommentez les lignes suivantes:
            /*
            const url = window.document.URL;
            const serverName = url.substring(0, url.indexOf("niku/") - 1);
            const filters = { year: selectedYear };
            rawData = ExecuteClarityQuery("dash_rashut_pm", serverName, filters);
            */

            // Données de test (correspond à ui_demo.png)
            rawData = generateTestData();

            console.log('Données chargées:', rawData);

            // Transforme et affiche les données
            renderChart();

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            showError('Erreur lors du chargement des données');
        }
    }

    /**
     * Transforme les données et affiche le graphique
     */
    function renderChart() {
        try {
            // Transforme les données brutes en structure hiérarchique
            const hierarchyData = dataTransformer.transformToHierarchy(rawData, selectedYear);

            console.log('Données transformées:', hierarchyData);

            // Affiche le graphique
            hierarchyChart.render(hierarchyData);

            console.log('Graphique affiché avec succès');

        } catch (error) {
            console.error('Erreur lors du rendu du graphique:', error);
            showError('Erreur lors du rendu du graphique');
        }
    }

    /**
     * Configure les écouteurs d'événements
     */
    function setupEventListeners() {
        // Écoute les changements d'année (si vous ajoutez un filtre)
        document.addEventListener('filterSelected', function(event) {
            selectedYear = parseInt(event.detail.year, 10);
            console.log('Année sélectionnée:', selectedYear);
            loadData();
        });

        // Écoute le redimensionnement de la fenêtre
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (hierarchyChart) {
                    renderChart();
                }
            }, 250);
        });
    }

    /**
     * Génère des données de test pour la démo
     * @returns {Array} Données de test
     */
    function generateTestData() {
        // Données fictives qui correspondent aux valeurs de ui_demo.png
        return [
            { id: 1, common_shaam: 'true', apro_start_year: 2025, statut_idea_changeme: '4', status: '8', start: '2025-01-01' },
            { id: 2, common_shaam: 'false', apro_start_year: 2025, statut_idea_changeme: '3', status: '1', start: '2025-02-01' },
            // ... autres données
        ];
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message - Message d'erreur
     */
    function showError(message) {
        const container = document.querySelector('.chart-container');
        container.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #d32f2f;">
                <div style="text-align: center;">
                    <h2>⚠ Erreur</h2>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }

    /**
     * Fonction publique pour mettre à jour le graphique
     * @param {number} year - Année à afficher
     */
    window.updateChart = function(year) {
        selectedYear = year;
        loadData();
    };

    /**
     * Fonction publique pour rafraîchir le graphique
     */
    window.refreshChart = function() {
        loadData();
    };

    // Démarre l'application quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
