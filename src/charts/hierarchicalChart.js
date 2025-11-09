/**
 * Module de rendu du graphique hiérarchique avec Chart.js
 * Utilise un graphique de type scatter avec des lignes personnalisées
 */

class HierarchicalChart {
    constructor(canvasId, config = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;
        this.config = config;
        this.data = null;
    }

    /**
     * Initialise et affiche le graphique
     * @param {Object} hierarchyData - Données transformées (nodes + connections)
     */
    render(hierarchyData) {
        this.data = hierarchyData;

        // Détruit le graphique existant si présent
        if (this.chart) {
            this.chart.destroy();
        }

        // Prépare les datasets pour Chart.js
        const datasets = this.prepareDatasets(hierarchyData);

        // Configuration du graphique
        const chartConfig = {
            type: 'scatter',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 40,
                        right: 100,
                        bottom: 40,
                        left: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 27, 91, 0.9)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const node = context.dataset.data[0].nodeData;
                                return node.title ? `${node.title}: ${node.label}` : node.label;
                            }
                        }
                    },
                    datalabels: {
                        // Configuration par défaut (sera surchargée par les datasets individuels)
                        display: true
                    }
                },
                scales: {
                    x: {
                        display: false,
                        min: 0,
                        max: 100,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: false,
                        min: 0,
                        max: 100,
                        reverse: true,  // Pour que le root soit en haut
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart'
                }
            },
            plugins: [{
                id: 'connectionLines',
                beforeDatasetsDraw: (chart) => {
                    this.drawConnections(chart);
                }
            }, {
                id: 'percentageBadges',
                afterDatasetsDraw: (chart) => {
                    this.drawPercentageBadges(chart);
                }
            }]
        };

        // Crée le graphique
        this.chart = new Chart(this.ctx, chartConfig);
    }

    /**
     * Prépare les datasets pour Chart.js
     * @param {Object} hierarchyData - Données de la hiérarchie
     * @returns {Array} - Datasets pour Chart.js
     */
    prepareDatasets(hierarchyData) {
        // Crée un dataset pour chaque node afin que datalabels fonctionne correctement
        return hierarchyData.nodes.map((node, index) => ({
            label: node.id,
            data: [{
                x: node.x,
                y: node.y,
                nodeData: node // Stocke les données du node
            }],
            backgroundColor: node.color || '#e8e8e8',
            borderColor: node.borderColor || '#4479ba',
            borderWidth: 3,
            pointRadius: 40, // Taille visible du point
            pointHoverRadius: 45,
            pointStyle: 'rect', // Style rectangulaire
            datalabels: {
                display: true,
                backgroundColor: node.color || '#e8e8e8',
                borderColor: node.borderColor || '#4479ba',
                borderWidth: 2,
                borderRadius: 8,
                color: '#001B5B',
                font: {
                    size: 14,
                    weight: 'bold',
                    family: 'Arial'
                },
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 18,
                    right: 18
                },
                align: 'center',
                anchor: 'center',
                formatter: function(value, context) {
                    // Accède aux données du node
                    const nodeData = context.dataset.data[0].nodeData;
                    if (nodeData.title) {
                        return [nodeData.title, nodeData.label];
                    }
                    return nodeData.label;
                }
            }
        }));
    }

    /**
     * Dessine les lignes de connexion entre les nœuds
     * @param {Chart} chart - Instance du graphique Chart.js
     */
    drawConnections(chart) {
        const ctx = chart.ctx;

        ctx.save();
        ctx.strokeStyle = '#4479ba';
        ctx.lineWidth = 2;

        this.data.connections.forEach(connection => {
            const fromNode = this.data.nodes.find(n => n.id === connection.from);
            const toNode = this.data.nodes.find(n => n.id === connection.to);

            if (!fromNode || !toNode) return;

            // Trouve les index des nodes
            const fromIndex = this.data.nodes.findIndex(n => n.id === connection.from);
            const toIndex = this.data.nodes.findIndex(n => n.id === connection.to);

            if (fromIndex === -1 || toIndex === -1) return;

            // Récupère les métadonnées des datasets correspondants
            const fromMeta = chart.getDatasetMeta(fromIndex);
            const toMeta = chart.getDatasetMeta(toIndex);

            if (!fromMeta || !toMeta || !fromMeta.data[0] || !toMeta.data[0]) return;

            const fromPoint = fromMeta.data[0];
            const toPoint = toMeta.data[0];

            // Dessine la ligne
            ctx.beginPath();
            ctx.moveTo(fromPoint.x, fromPoint.y);

            // Ligne verticale puis horizontale (style flowchart)
            if (fromNode.level < toNode.level) {
                const midY = (fromPoint.y + toPoint.y) / 2;
                ctx.lineTo(fromPoint.x, midY);
                ctx.lineTo(toPoint.x, midY);
                ctx.lineTo(toPoint.x, toPoint.y);
            } else {
                ctx.lineTo(toPoint.x, toPoint.y);
            }

            ctx.stroke();
        });

        ctx.restore();
    }

    /**
     * Dessine les badges de pourcentage
     * @param {Chart} chart - Instance du graphique Chart.js
     */
    drawPercentageBadges(chart) {
        const ctx = chart.ctx;

        ctx.save();

        this.data.nodes.forEach((node, index) => {
            if (!node.showPercentage) return;

            // Récupère les métadonnées du dataset correspondant
            const meta = chart.getDatasetMeta(index);
            if (!meta || !meta.data[0]) return;

            const point = meta.data[0];

            // Position du badge (au-dessus à droite du nœud)
            const badgeX = point.x + 60;
            const badgeY = point.y - 30;

            // Dessine le fond du badge
            ctx.fillStyle = '#ffe6e6';
            ctx.strokeStyle = '#cc7d75';
            ctx.lineWidth = 2;

            const badgeWidth = 70;
            const badgeHeight = 35;
            const radius = 17;

            ctx.beginPath();
            ctx.roundRect(badgeX - badgeWidth/2, badgeY - badgeHeight/2, badgeWidth, badgeHeight, radius);
            ctx.fill();
            ctx.stroke();

            // Dessine le texte du badge
            ctx.fillStyle = '#d32f2f';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText('שיעור ביצוע:', badgeX, badgeY - 8);
            ctx.font = 'bold 16px Arial';
            ctx.fillText(node.percentage, badgeX, badgeY + 8);
        });

        ctx.restore();
    }

    /**
     * Met à jour le graphique avec de nouvelles données
     * @param {Object} hierarchyData - Nouvelles données
     */
    update(hierarchyData) {
        this.render(hierarchyData);
    }

    /**
     * Détruit le graphique
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Export pour utilisation dans d'autres modules
window.HierarchicalChart = HierarchicalChart;
