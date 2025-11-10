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

            // Update header badges with calculated statistics
            updateHeaderBadges();

            console.log('Graphique affiché avec succès');

        } catch (error) {
            console.error('Erreur lors du rendu du graphique:', error);
            showError('Erreur lors du rendu du graphique');
        }
    }

    /**
     * Updates the header badges with dynamic data
     */
    function updateHeaderBadges() {
        // Calculate statistics from the current data
        const stats = dataTransformer.calculateStatistics(rawData, selectedYear);

        // Update each badge value
        const badges = {
            primary: document.querySelector('.badge-primary .badge-value'),
            secondary: document.querySelector('.badge-secondary .badge-value'),
            tertiary: document.querySelector('.badge-tertiary .badge-value'),
            quaternary: document.querySelector('.badge-quaternary .badge-value')
        };

        if (badges.primary) {
            // General completion - average of both branches
            const generalCompletion = Math.round(
                (parseFloat(stats.withShaam.percentage) + parseFloat(stats.withoutShaam.percentage)) / 2
            );
            badges.primary.textContent = generalCompletion + '%';
        }

        if (badges.secondary && stats.withShaam.new.converted > 0) {
            // Converted projects completion
            const convertedCompletion = Math.round(
                (stats.withShaam.new.executing / stats.withShaam.new.converted) * 100
            );
            badges.secondary.textContent = convertedCompletion + '%';
        }

        if (badges.tertiary) {
            // Annual completion - without shaam percentage
            badges.tertiary.textContent = stats.withoutShaam.percentage;
        }

        if (badges.quaternary) {
            // Quarterly completion - with shaam percentage
            badges.quaternary.textContent = stats.withShaam.percentage;
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

    /**
     * Public function to update badges with custom values
     * @param {Object} values - Object with badge values { primary, secondary, tertiary, quaternary }
     */
    window.updateBadges = function(values) {
        if (values.primary !== undefined) {
            const badge = document.querySelector('.badge-primary .badge-value');
            if (badge) badge.textContent = values.primary + '%';
        }
        if (values.secondary !== undefined) {
            const badge = document.querySelector('.badge-secondary .badge-value');
            if (badge) badge.textContent = values.secondary + '%';
        }
        if (values.tertiary !== undefined) {
            const badge = document.querySelector('.badge-tertiary .badge-value');
            if (badge) badge.textContent = values.tertiary + '%';
        }
        if (values.quaternary !== undefined) {
            const badge = document.querySelector('.badge-quaternary .badge-value');
            if (badge) badge.textContent = values.quaternary + '%';
        }
    };

    // Start application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
