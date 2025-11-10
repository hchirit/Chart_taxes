/**
 * Main application entry point
 * Orchestrates chart initialization and updates
 */

(function() {
    'use strict';

    // Global variables
    let hierarchyChart = null;
    let dataTransformer = null;
    let selectedYear = 2025;
    let rawData = null;

    /**
     * Initializes the application
     */
    function init() {
        console.log('Initialisation de l\'application...');

        // Create module instances
        dataTransformer = new DataTransformer();
        hierarchyChart = new HierarchicalChart('hierarchyChart');

        // Load data
        loadData();

        // Setup events
        setupEventListeners();
    }

    /**
     * Loads data from getDataFromQuery
     */
    function loadData() {
        try {
            // Fetch data from server
            // Uses ExecuteClarityQuery function from getDataFromQuery.js

            // For demo, use data from data.js
            // In production, uncomment the following lines:
            /*
            const url = window.document.URL;
            const serverName = url.substring(0, url.indexOf("niku/") - 1);
            const filters = { year: selectedYear };
            rawData = ExecuteClarityQuery("dash_rashut_pm", serverName, filters);
            */

            // Use data from data.js (global variable allIdea)
            if (typeof allIdea !== 'undefined') {
                rawData = allIdea;
                console.log('Données chargées depuis data.js:', rawData.length, 'enregistrements');
            } else {
                console.warn('Variable allIdea non trouvée, utilisation de données de test');
                rawData = generateTestData();
            }

            console.log('Données chargées:', rawData);

            // Transform and display data
            renderChart();

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            showError('Erreur lors du chargement des données');
        }
    }

    /**
     * Transforms data and displays the chart
     */
    function renderChart() {
        try {
            // Transform raw data into hierarchical structure
            const hierarchyData = dataTransformer.transformToHierarchy(rawData, selectedYear);

            console.log('Données transformées:', hierarchyData);

            // Display the chart
            hierarchyChart.render(hierarchyData);

            console.log('Graphique affiché avec succès');

        } catch (error) {
            console.error('Erreur lors du rendu du graphique:', error);
            showError('Erreur lors du rendu du graphique');
        }
    }

    /**
     * Sets up event listeners
     */
    function setupEventListeners() {
        // Listen for year changes (if you add a filter)
        document.addEventListener('filterSelected', function(event) {
            selectedYear = parseInt(event.detail.year, 10);
            console.log('Année sélectionnée:', selectedYear);
            loadData();
        });

        // Listen for window resize
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
     * Generates test data for demo
     * @returns {Array} Test data
     */
    function generateTestData() {
        // Fake data matching ui_demo.png values
        return [
            { id: 1, common_shaam: 'true', apro_start_year: 2025, statut_idea_changeme: '4', status: '8', start: '2025-01-01' },
            { id: 2, common_shaam: 'false', apro_start_year: 2025, statut_idea_changeme: '3', status: '1', start: '2025-02-01' },
            // ... other data
        ];
    }

    /**
     * Displays an error message
     * @param {string} message - Error message
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
     * Public function to update the chart
     * @param {number} year - Year to display
     */
    window.updateChart = function(year) {
        selectedYear = year;
        loadData();
    };

    /**
     * Public function to refresh the chart
     */
    window.refreshChart = function() {
        loadData();
    };

    // Start application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
