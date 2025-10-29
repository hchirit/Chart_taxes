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
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    },
                    datalabels: {
                        display: true,
                        align: 'center',
                        anchor: 'center',
                        backgroundColor: function(context) {
                            const dataIndex = context.dataIndex;
                            const node = hierarchyData.nodes[dataIndex];
                            return node ? node.color : '#ffffff';
                        },
                        borderColor: function(context) {
                            const dataIndex = context.dataIndex;
                            const node = hierarchyData.nodes[dataIndex];
                            return node ? node.borderColor : '#4479ba';
                        },
                        borderWidth: 2,
                        borderRadius: 8,
                        color: '#001B5B',
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: 'Arial'
                        },
                        padding: {
                            top: 12,
                            bottom: 12,
                            left: 20,
                            right: 20
                        },
                        formatter: function(value, context) {
                            const dataIndex = context.dataIndex;
                            const node = hierarchyData.nodes[dataIndex];
                            if (!node) return '';

                            let text = node.label;
                            if (node.title) {
                                text = node.title + '\n' + node.label;
                            }

                            return text;
                        }
                    }
                },
                scales: {
                    x: {
                        display: false,
                        min: 0,
                        max: 100
                    },
                    y: {
                        display: false,
                        min: 0,
                        max: 100,
                        reverse: true  // Pour que le root soit en haut
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeInOutQuart'
                }
            },
            plugins: [{
                id: 'connectionLines',
                afterDatasetsDraw: (chart) => {
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
        const points = hierarchyData.nodes.map(node => ({
            x: node.x,
            y: node.y
        }));

        return [{
            label: 'Nodes',
            data: points,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            pointRadius: 0,
            pointHoverRadius: 0
        }];
    }

    /**
     * Dessine les lignes de connexion entre les nœuds
     * @param {Chart} chart - Instance du graphique Chart.js
     */
    drawConnections(chart) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);

        ctx.save();
        ctx.strokeStyle = '#4479ba';
        ctx.lineWidth = 2;

        this.data.connections.forEach(connection => {
            const fromNode = this.data.nodes.find(n => n.id === connection.from);
            const toNode = this.data.nodes.find(n => n.id === connection.to);

            if (!fromNode || !toNode) return;

            const fromPoint = meta.data.find(point => {
                const dataIndex = point.index;
                return this.data.nodes[dataIndex]?.id === connection.from;
            });

            const toPoint = meta.data.find(point => {
                const dataIndex = point.index;
                return this.data.nodes[dataIndex]?.id === connection.to;
            });

            if (!fromPoint || !toPoint) return;

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
        const meta = chart.getDatasetMeta(0);

        ctx.save();

        this.data.nodes.forEach((node, index) => {
            if (!node.showPercentage) return;

            const point = meta.data[index];
            if (!point) return;

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
