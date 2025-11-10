/**
 * Filter Manager
 * Gère les filtres et leur impact sur les graphiques
 */

class FilterManager {
    constructor() {
        this.filters = {
            year: '',
            obs: '',
            taskUpdates: '',
            responsible: ''
        };

        this.initializeFilters();
    }

    /**
     * Initialise les écouteurs d'événements pour tous les filtres
     */
    initializeFilters() {
        // Filtre année
        const yearFilter = document.getElementById('yearFilter');
        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.filters.year = e.target.value;
                this.onFilterChange();
            });
        }

        // Filtre OBS
        const obsFilter = document.getElementById('obsFilter');
        if (obsFilter) {
            obsFilter.addEventListener('change', (e) => {
                this.filters.obs = e.target.value;
                this.onFilterChange();
            });
        }

        // Filtre mises à jour de tâches
        const taskUpdatesFilter = document.getElementById('taskUpdatesFilter');
        if (taskUpdatesFilter) {
            taskUpdatesFilter.addEventListener('change', (e) => {
                this.filters.taskUpdates = e.target.value;
                this.onFilterChange();
            });
        }

        // Filtre responsable
        const responsibleFilter = document.getElementById('responsibleFilter');
        if (responsibleFilter) {
            responsibleFilter.addEventListener('change', (e) => {
                this.filters.responsible = e.target.value;
                this.onFilterChange();
            });
        }
    }

    /**
     * Appelé lorsqu'un filtre change
     * Cette méthode peut être étendue pour rafraîchir tous les graphiques
     */
    onFilterChange() {
        console.log('Filtres actifs:', this.filters);

        // Déclencher un événement personnalisé pour notifier les composants
        const event = new CustomEvent('filtersChanged', {
            detail: { filters: this.filters }
        });
        document.dispatchEvent(event);

        // Rafraîchir les graphiques avec les nouveaux filtres
        this.refreshCharts();
    }

    /**
     * Rafraîchit tous les graphiques en fonction des filtres actifs
     */
    refreshCharts() {
        // Cette méthode sera appelée pour mettre à jour tous les graphiques
        // Vous pouvez l'étendre pour appeler des fonctions de mise à jour spécifiques
        console.log('Rafraîchissement des graphiques avec les filtres:', this.filters);

        // Exemple: si vous avez une fonction globale pour mettre à jour les graphiques
        if (typeof window.updateAllCharts === 'function') {
            window.updateAllCharts(this.filters);
        }
    }

    /**
     * Obtenir les filtres actifs
     */
    getActiveFilters() {
        return { ...this.filters };
    }

    /**
     * Réinitialiser tous les filtres
     */
    resetFilters() {
        this.filters = {
            year: '',
            obs: '',
            taskUpdates: '',
            responsible: ''
        };

        // Réinitialiser les select dans le DOM
        document.getElementById('yearFilter').value = '';
        document.getElementById('obsFilter').value = '';
        document.getElementById('taskUpdatesFilter').value = '';
        document.getElementById('responsibleFilter').value = '';

        this.onFilterChange();
    }

    /**
     * Peupler dynamiquement un filtre avec des données
     * @param {string} filterId - L'ID du select à peupler
     * @param {Array} options - Tableau d'objets {value, label}
     */
    populateFilter(filterId, options) {
        const selectElement = document.getElementById(filterId);
        if (!selectElement) return;

        // Garder la première option (placeholder)
        const placeholder = selectElement.options[0];
        selectElement.innerHTML = '';
        selectElement.appendChild(placeholder);

        // Ajouter les nouvelles options
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            selectElement.appendChild(optionElement);
        });
    }
}

// Initialiser le gestionnaire de filtres au chargement de la page
let filterManager;
document.addEventListener('DOMContentLoaded', () => {
    filterManager = new FilterManager();
    console.log('✓ Gestionnaire de filtres initialisé');
});
