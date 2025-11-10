/**
 * Common configuration for all Chart.js charts
 */

const ChartConfig = {
    // Default colors for different node types
    colors: {
        new: {
            background: '#d2e9ab',
            border: '#4479ba'
        },
        continued: {
            background: '#ffd699',
            border: '#e6a15d'
        },
        midyear: {
            background: '#d6e9f5',
            border: '#4479ba'
        },
        cancelled: {
            background: '#f4c2d4',
            border: '#cc7d75'
        },
        approved: {
            background: '#c8e6c9',
            border: '#4479ba'
        },
        converted: {
            background: '#fff9c4',
            border: '#4479ba'
        },
        default: {
            background: '#e8e8e8',
            border: '#4479ba'
        }
    },

    // Font configuration
    fonts: {
        main: {
            family: 'Arial, sans-serif',
            size: 16,
            weight: 'bold',
            color: '#001B5B'
        },
        title: {
            family: 'Arial, sans-serif',
            size: 14,
            weight: 'normal',
            color: '#586069'
        },
        label: {
            family: 'Arial, sans-serif',
            size: 24,
            weight: 'bold',
            color: '#001B5B'
        }
    },

    // Animation configuration
    animation: {
        duration: 800,
        easing: 'easeInOutQuart'
    },

    // Default Chart.js configuration
    defaults: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 27, 91, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#4479ba',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                }
            }
        }
    },

    // Helper to get color by type
    getColor(type) {
        return this.colors[type] || this.colors.default;
    },

    // Helper to format a number
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Helper to format a percentage
    formatPercentage(value) {
        return parseFloat(value).toFixed(2) + '%';
    }
};

// Export for use in other modules
window.ChartConfig = ChartConfig;
