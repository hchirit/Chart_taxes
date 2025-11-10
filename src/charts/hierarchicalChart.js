/**
 * Hierarchical chart rendering module using Chart.js
 * Uses a scatter chart type with custom lines
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
     * Initializes and displays the chart
     * @param {Object} hierarchyData - Transformed data (nodes + connections)
     */
    render(hierarchyData) {
        this.data = hierarchyData;

        // Destroy existing chart if present
        if (this.chart) {
            this.chart.destroy();
        }

        // Prepare datasets for Chart.js
        const datasets = this.prepareDatasets(hierarchyData);

        // Chart configuration
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
                        top: 80, // Increased for percentage badges
                        right: 120,
                        bottom: 40,
                        left: 120
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 27, 91, 0.9)',
                        padding: 15,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const node = context.dataset.data[0].nodeData;
                                return node.title ? `${node.title}: ${node.label}` : node.label;
                            }
                        }
                    },
                    datalabels: {
                        // Default configuration (will be overridden by individual datasets)
                        display: true,
                        // Enable 'listeners' mode so labels are clickable/hoverable
                        listeners: {
                            enter: function(context) {
                                // Change cursor on hover
                                context.chart.canvas.style.cursor = 'pointer';
                            },
                            leave: function(context) {
                                context.chart.canvas.style.cursor = 'default';
                            }
                        }
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
                        reverse: true,  // So the root is at the top
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

        // Create the chart
        this.chart = new Chart(this.ctx, chartConfig);
    }

    /**
     * Prepares datasets for Chart.js
     * @param {Object} hierarchyData - Hierarchy data
     * @returns {Array} - Datasets for Chart.js
     */
    prepareDatasets(hierarchyData) {
        // Create a dataset for each node so datalabels works correctly
        return hierarchyData.nodes.map((node, index) => ({
            label: node.id,
            data: [{
                x: node.x,
                y: node.y,
                nodeData: node // Store node data
            }],
            backgroundColor: 'transparent', // Make the point invisible
            borderColor: 'transparent',
            borderWidth: 0,
            pointRadius: 0, // Invisible point - only datalabels will be visible
            pointHoverRadius: 0,
            pointStyle: 'rect',
            datalabels: {
                display: true,
                backgroundColor: node.color || '#e8e8e8',
                borderColor: node.borderColor || '#4479ba',
                borderWidth: 3,
                borderRadius: 8,
                color: '#001B5B',
                font: {
                    size: 15,
                    weight: 'bold',
                    family: 'Arial'
                },
                padding: {
                    top: 18,
                    bottom: 18,
                    left: 25,
                    right: 25
                },
                align: 'center',
                anchor: 'center',
                textAlign: 'center',
                formatter: function(value, context) {
                    // Access node data
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
     * Draws connection lines between nodes
     * @param {Chart} chart - Chart.js instance
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

            // Find node indexes
            const fromIndex = this.data.nodes.findIndex(n => n.id === connection.from);
            const toIndex = this.data.nodes.findIndex(n => n.id === connection.to);

            if (fromIndex === -1 || toIndex === -1) return;

            // Get metadata from corresponding datasets
            const fromMeta = chart.getDatasetMeta(fromIndex);
            const toMeta = chart.getDatasetMeta(toIndex);

            if (!fromMeta || !toMeta || !fromMeta.data[0] || !toMeta.data[0]) return;

            const fromPoint = fromMeta.data[0];
            const toPoint = toMeta.data[0];

            // Draw the line
            ctx.beginPath();
            ctx.moveTo(fromPoint.x, fromPoint.y);

            // Vertical then horizontal line (flowchart style)
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
     * Draws percentage badges
     * @param {Chart} chart - Chart.js instance
     */
    drawPercentageBadges(chart) {
        const ctx = chart.ctx;

        ctx.save();

        this.data.nodes.forEach((node, index) => {
            if (!node.showPercentage) return;

            // Get metadata from corresponding dataset
            const meta = chart.getDatasetMeta(index);
            if (!meta || !meta.data[0]) return;

            const point = meta.data[0];

            // Badge position (above and to the right of the node, higher for better visibility)
            const badgeX = point.x;
            const badgeY = point.y - 60; // Moved higher (was -30)

            // Draw badge background
            ctx.fillStyle = '#ffe6e6';
            ctx.strokeStyle = '#cc7d75';
            ctx.lineWidth = 2.5;

            const badgeWidth = 100;
            const badgeHeight = 38;
            const radius = 19;

            ctx.beginPath();
            ctx.roundRect(badgeX - badgeWidth/2, badgeY - badgeHeight/2, badgeWidth, badgeHeight, radius);
            ctx.fill();
            ctx.stroke();

            // Draw badge text
            ctx.fillStyle = '#d32f2f';
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText('שיעור ביצוע:', badgeX, badgeY - 8);
            ctx.font = 'bold 17px Arial';
            ctx.fillText(node.percentage, badgeX, badgeY + 9);
        });

        ctx.restore();
    }

    /**
     * Updates the chart with new data
     * @param {Object} hierarchyData - New data
     */
    update(hierarchyData) {
        this.render(hierarchyData);
    }

    /**
     * Destroys the chart
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Export for use in other modules
window.HierarchicalChart = HierarchicalChart;
