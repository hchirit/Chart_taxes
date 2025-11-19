/**
 * Bar Chart - Graphique en barres verticales
 * Affiche le nombre de tâches par unité avec pourcentages d'exécution
 */

class BarChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.chart = null;
    }

    /**
     * Détruit le graphique existant
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    /**
     * Rend le graphique avec les données fournies
     * @param {Object} data - Données structurées pour le graphique
     * @param {Array} data.units - Liste des unités avec leurs statistiques
     * @param {number} data.globalAverage - Moyenne globale des pourcentages
     * @param {number} data.totalTasks - Nombre total de tâches
     */
    render(data) {
        if (!this.canvas) {
            console.error('Canvas non trouvé');
            return;
        }

        // Détruire le graphique existant
        this.destroy();

        // Préparer les données pour Chart.js
        const labels = data.units.map(unit => unit.name);
        const taskCounts = data.units.map(unit => unit.taskCount);
        const percentages = data.units.map(unit => unit.percentage);
        const colors = data.units.map(unit => unit.color);

        // Créer le graphique
        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'סה"כ משימות',
                        data: taskCounts,
                        backgroundColor: colors,
                        borderColor: colors.map(color => this.darkenColor(color, 20)),
                        borderWidth: 2,
                        yAxisID: 'y',
                        order: 2
                    },
                    {
                        label: 'ממוצע כללי',
                        data: Array(labels.length).fill(data.globalAverage),
                        type: 'line',
                        borderColor: '#d32f2f',
                        borderWidth: 3,
                        pointRadius: 0,
                        fill: false,
                        yAxisID: 'y',
                        order: 1,
                        datalabels: {
                            display: false
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        rtl: true,
                        textDirection: 'rtl',
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    const percentage = percentages[context.dataIndex];
                                    return `משימות: ${context.parsed.y} | ביצוע: ${percentage}%`;
                                }
                                return `ממוצע כללי: ${context.parsed.y.toFixed(0)}`;
                            }
                        }
                    },
                    datalabels: {
                        display: function(context) {
                            return context.datasetIndex === 0; // Only show for bars
                        },
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        font: {
                            size: 11,
                            weight: 'bold',
                            family: 'Arial, sans-serif'
                        },
                        color: '#000',
                        formatter: function(value, context) {
                            const percentage = percentages[context.dataIndex];
                            // Afficher le nombre et le pourcentage
                            return value > 0 ? value : '';
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 14,
                                family: 'Arial, sans-serif'
                            },
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'סה"כ משימות',
                            font: {
                                size: 14,
                                weight: 'bold',
                                family: 'Arial, sans-serif'
                            }
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'אחוז ביצוע',
                            font: {
                                size: 14,
                                weight: 'bold',
                                family: 'Arial, sans-serif'
                            }
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            },
            plugins: [{
                id: 'percentageLabels',
                afterDatasetsDraw: (chart) => {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        if (datasetIndex !== 0) return; // Only for bar dataset

                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const percentage = percentages[index];
                            if (percentage !== null && percentage !== undefined) {
                                // Position du label
                                const x = bar.x;
                                const y = bar.y - 20; // 20px au-dessus de la valeur

                                // Style du texte
                                ctx.save();
                                ctx.font = 'bold 12px Arial';
                                ctx.fillStyle = '#6a1b9a'; // Violet
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';

                                // Dessiner le pourcentage
                                ctx.fillText(percentage + '%', x, y);
                                ctx.restore();
                            }
                        });
                    });
                },
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    const yAxis = chart.scales.y;
                    const xAxis = chart.scales.x;
                    const globalAvg = data.globalAverage;

                    // Calculer la position Y de la ligne
                    const yPos = yAxis.getPixelForValue(globalAvg);

                    // Dessiner le label "78%" sur la ligne rouge
                    ctx.save();
                    ctx.font = 'bold 13px Arial';
                    ctx.fillStyle = '#d32f2f';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'bottom';

                    // Position à droite du graphique
                    const labelX = xAxis.right - 5;
                    const labelY = yPos - 5;

                    ctx.fillText(Math.round(globalAvg) + '%', labelX, labelY);
                    ctx.restore();
                }
            }]
        });

        console.log('✓ Bar chart rendu avec succès');
    }

    /**
     * Assombrit une couleur hexadécimale
     * @param {string} color - Couleur hex (#RRGGBB)
     * @param {number} percent - Pourcentage d'assombrissement
     * @returns {string} Couleur assombrie
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
}

// Exposer la classe globalement
window.BarChart = BarChart;
