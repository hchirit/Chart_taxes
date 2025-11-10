/**
 * Data transformation module for hierarchical chart
 * Transforms raw data into a structure usable by Chart.js
 */

class DataTransformer {
    constructor() {
        this.nodePositions = new Map();
    }

    /**
     * Transforms raw data into hierarchical structure
     * @param {Object} rawData - Data from getDataFromQuery
     * @param {number} selectedYear - Selected year
     * @returns {Object} - Data structure for the chart
     */
    transformToHierarchy(rawData, selectedYear) {
        // Calculate real statistics from the data
        const stats = this.calculateStatistics(rawData, selectedYear);
        console.log('Statistiques calculées:', stats);

        // Node structure based on calculated data
        const nodes = [
            {
                id: 'root',
                label: stats.total.toLocaleString('he-IL'),
                title: 'סה"כ משימות',
                level: 0,
                x: 50,
                y: 8,
                color: '#d6e9f5',
                borderColor: '#4479ba'
            },
            // Level 1 - Left (משימות רשות המיסים)
            {
                id: 'right-branch',
                label: stats.withoutShaam.total.toString(),
                title: 'משימות רשות המיסים',
                subtitle: 'שיעור ביצוע: ' + stats.withoutShaam.percentage,
                level: 1,
                x: 72,
                y: 24,
                color: '#e8e8e8',
                borderColor: '#4479ba',
                showPercentage: true,
                percentage: stats.withoutShaam.percentage
            },
            // Level 1 - Right (משימות בשיתוף שע"מ)
            {
                id: 'left-branch',
                label: stats.withShaam.total.toString(),
                title: 'משימות בשיתוף שע"מ',
                subtitle: 'שיעור ביצוע: ' + stats.withShaam.percentage,
                level: 1,
                x: 28,
                y: 24,
                color: '#e8e8e8',
                borderColor: '#4479ba',
                showPercentage: true,
                percentage: stats.withShaam.percentage
            },

            // Level 2 - Left branch (משימות רשות המיסים)
            {
                id: 'right-new',
                label: stats.withoutShaam.new.toString(),
                title: 'חדשות',
                level: 2,
                x: 60,
                y: 42,
                color: '#d2e9ab',
                borderColor: '#4479ba'
            },
            {
                id: 'right-continued',
                label: stats.withoutShaam.continued.toString(),
                title: 'ממשיכות',
                level: 2,
                x: 72,
                y: 42,
                color: '#ffd699',
                borderColor: '#e6a15d'
            },
            {
                id: 'right-midyear',
                label: stats.withoutShaam.midyear.toString(),
                title: 'אמצע שנה',
                level: 2,
                x: 84,
                y: 42,
                color: '#d6e9f5',
                borderColor: '#4479ba'
            },
            {
                id: 'right-cancelled',
                label: stats.withoutShaam.cancelled.toString(),
                title: 'מבוטלות',
                level: 2,
                x: 94,
                y: 42,
                color: '#f4c2d4',
                borderColor: '#cc7d75'
            },

            // Level 2 - Right branch (בשיתוף שע"מ)
            {
                id: 'left-new',
                label: stats.withShaam.new.total.toString(),
                title: 'חדשות',
                level: 2,
                x: 16,
                y: 42,
                color: '#d2e9ab',
                borderColor: '#4479ba'
            },
            {
                id: 'left-continued',
                label: stats.withShaam.continued.toString(),
                title: 'ממשיכות',
                level: 2,
                x: 28,
                y: 42,
                color: '#ffd699',
                borderColor: '#e6a15d'
            },
            {
                id: 'left-midyear',
                label: stats.withShaam.midyear.total.toString(),
                title: 'אמצע שנה',
                level: 2,
                x: 40,
                y: 42,
                color: '#d6e9f5',
                borderColor: '#4479ba'
            },

            // Level 3 - Sub-nodes of "חדשות" (right left - with shaam)
            {
                id: 'left-new-approved',
                label: stats.withShaam.new.approved.toString(),
                title: 'מאושר לביצוע',
                level: 3,
                x: 4,
                y: 62,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            },
            {
                id: 'left-new-converted',
                label: stats.withShaam.new.converted.toString(),
                title: 'הומר',
                level: 3,
                x: 13,
                y: 62,
                color: '#fff9c4',
                borderColor: '#4479ba'
            },
            {
                id: 'left-new-cancelled',
                label: stats.withShaam.new.cancelled.toString(),
                title: 'מבוטלות',
                level: 3,
                x: 21,
                y: 62,
                color: '#f4c2d4',
                borderColor: '#cc7d75'
            },

            // Level 3 - Sub-nodes of "אמצע שנה" (right left - with shaam)
            {
                id: 'left-midyear-approved',
                label: stats.withShaam.midyear.approved.toString(),
                title: 'מאושר לביצוע',
                level: 3,
                x: 31.5,
                y: 62,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            },
            {
                id: 'left-midyear-converted',
                label: stats.withShaam.midyear.converted.toString(),
                title: 'הומר',
                level: 3,
                x: 40,
                y: 62,
                color: '#fff9c4',
                borderColor: '#4479ba'
            },
            {
                id: 'left-midyear-cancelled',
                label: stats.withShaam.midyear.cancelled.toString(),
                title: 'מבוטלות',
                level: 3,
                x: 47.5,
                y: 62,
                color: '#f4c2d4',
                borderColor: '#cc7d75'
            },

            // Level 4 - Sub-nodes of "הומר" (new)
            {
                id: 'left-new-converted-executing',
                label: stats.withShaam.new.executing.toString(),
                title: 'הסתיימו',
                level: 4,
                x: 13,
                y: 82,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            },

            // Level 4 - Sub-nodes of "הומר" (midyear)
            {
                id: 'left-midyear-converted-executing',
                label: stats.withShaam.midyear.executing.toString(),
                title: 'הסתיימו',
                level: 4,
                x: 40,
                y: 82,
                color: '#c8e6c9',
                borderColor: '#4479ba'
            }
        ];

        console.log('Nodes créés:', nodes.length, nodes);

        // Connections between nodes
        const connections = [
            // Root to level 1
            { from: 'root', to: 'right-branch', label: '' },
            { from: 'root', to: 'left-branch', label: '' },

            // Right branch (משימות רשות המיסים)
            { from: 'right-branch', to: 'right-new', label: '' },
            { from: 'right-branch', to: 'right-continued', label: '' },
            { from: 'right-branch', to: 'right-midyear', label: '' },
            { from: 'right-branch', to: 'right-cancelled', label: '' },

            // Left branch (בשיתוף שע"מ)
            { from: 'left-branch', to: 'left-new', label: '' },
            { from: 'left-branch', to: 'left-continued', label: '' },
            { from: 'left-branch', to: 'left-midyear', label: '' },

            // Sub-nodes of "חדשות" (395)
            { from: 'left-new', to: 'left-new-approved', label: '' },
            { from: 'left-new', to: 'left-new-converted', label: '' },
            { from: 'left-new', to: 'left-new-cancelled', label: '' },

            // Sub-nodes of "אמצע שנה" (119)
            { from: 'left-midyear', to: 'left-midyear-approved', label: '' },
            { from: 'left-midyear', to: 'left-midyear-converted', label: '' },
            { from: 'left-midyear', to: 'left-midyear-cancelled', label: '' },

            // Level 4
            { from: 'left-new-converted', to: 'left-new-converted-executing', label: '' },
            { from: 'left-midyear-converted', to: 'left-midyear-converted-executing', label: '' }
        ];

        return { nodes, connections };
    }

    /**
     * Calculates statistics from raw data
     * @param {Array} rawData - Raw data
     * @param {number} selectedYear - Selected year
     * @returns {Object} - Calculated statistics
     */
    calculateStatistics(rawData, selectedYear) {
        if (!rawData || !Array.isArray(rawData)) {
            return this.getDefaultStatistics();
        }

        // Filter by year if necessary
        const filteredData = selectedYear
            ? rawData.filter(item => item.apro_start_year === selectedYear.toString())
            : rawData;

        // Total
        const total = filteredData.length;

        // Split by common_shaam
        const withShaam = filteredData.filter(item => item.common_shaam === 'true');
        const withoutShaam = filteredData.filter(item => item.common_shaam === 'false');

        // Calculate completion percentages
        const shaamCompleted = withShaam.filter(item => item.percent_complete && parseFloat(item.percent_complete) > 0);
        const shaamAvgCompletion = shaamCompleted.length > 0
            ? (shaamCompleted.reduce((sum, item) => sum + parseFloat(item.percent_complete || 0), 0) / shaamCompleted.length * 100).toFixed(0)
            : 0;

        const withoutShaamCompleted = withoutShaam.filter(item => item.status === '8'); // Completed status
        const withoutShaamAvgCompletion = withoutShaam.length > 0
            ? (withoutShaamCompleted.length / withoutShaam.length * 100).toFixed(0)
            : 0;

        // Calculate sub-categories for "with shaam" (common_shaam = true)
        const shaamNew = withShaam.filter(item => item.statut_idea_changeme === '4' || item.statut_idea_changeme === '1');
        const shaamContinued = withShaam.filter(item => item.statut_idea_changeme === '2');
        const shaamMidyear = withShaam.filter(item => item.statut_idea_changeme === '3');

        // Calculate sub-categories for "without shaam" (common_shaam = false)
        const withoutShaamNew = withoutShaam.filter(item => item.statut_idea_changeme === '4' || item.statut_idea_changeme === '1');
        const withoutShaamContinued = withoutShaam.filter(item => item.statut_idea_changeme === '2');
        const withoutShaamMidyear = withoutShaam.filter(item => item.statut_idea_changeme === '3');
        const withoutShaamCancelled = withoutShaam.filter(item => item.canceled_year);

        // Sub-levels for "new" with shaam
        const shaamNewApproved = shaamNew.filter(item => item.verification_statut === '6');
        const shaamNewConverted = shaamNew.filter(item => item.status === '8');
        const shaamNewCancelled = shaamNew.filter(item => item.canceled_year);

        // Sub-levels for "midyear" with shaam
        const shaamMidyearApproved = shaamMidyear.filter(item => item.verification_statut === '6');
        const shaamMidyearConverted = shaamMidyear.filter(item => item.status === '8');
        const shaamMidyearCancelled = shaamMidyear.filter(item => item.canceled_year);

        // Deepest level
        const shaamNewConvertedExecuting = shaamNewConverted.filter(item => item.percent_complete && parseFloat(item.percent_complete) >= 1);
        const shaamMidyearConvertedExecuting = shaamMidyearConverted.filter(item => item.percent_complete && parseFloat(item.percent_complete) >= 1);

        return {
            total,
            withShaam: {
                total: withShaam.length,
                percentage: shaamAvgCompletion + '%',
                new: {
                    total: shaamNew.length,
                    approved: shaamNewApproved.length,
                    converted: shaamNewConverted.length,
                    cancelled: shaamNewCancelled.length,
                    executing: shaamNewConvertedExecuting.length
                },
                continued: shaamContinued.length,
                midyear: {
                    total: shaamMidyear.length,
                    approved: shaamMidyearApproved.length,
                    converted: shaamMidyearConverted.length,
                    cancelled: shaamMidyearCancelled.length,
                    executing: shaamMidyearConvertedExecuting.length
                }
            },
            withoutShaam: {
                total: withoutShaam.length,
                percentage: withoutShaamAvgCompletion + '%',
                new: withoutShaamNew.length,
                continued: withoutShaamContinued.length,
                midyear: withoutShaamMidyear.length,
                cancelled: withoutShaamCancelled.length
            }
        };
    }

    /**
     * Returns default statistics if no data available
     * @returns {Object} - Default statistics
     */
    getDefaultStatistics() {
        return {
            total: 1496,
            withShaam: {
                total: 590,
                percentage: '80%',
                new: { total: 395, approved: 75, converted: 286, cancelled: 34, executing: 242 },
                continued: 73,
                midyear: { total: 119, approved: 13, converted: 104, cancelled: 2, executing: 91 }
            },
            withoutShaam: {
                total: 906,
                percentage: '77%',
                new: 437,
                continued: 167,
                midyear: 175,
                cancelled: 97
            }
        };
    }

    /**
     * Calculates an average percentage
     * @param {Array} values - Array of values
     * @returns {string} - Formatted percentage
     */
    calculateAverage(values) {
        if (!values || values.length === 0) return '0%';
        const sum = values.reduce((acc, val) => acc + Number(val), 0);
        const avg = (sum / values.length) * 100;
        return avg.toFixed(2) + '%';
    }

    /**
     * Filters data by year
     * @param {Array} data - Raw data
     * @param {number} year - Year to filter
     * @returns {Array} - Filtered data
     */
    filterByYear(data, year) {
        if (!data || !Array.isArray(data)) return [];
        return data.filter(item => {
            const itemYear = new Date(item.start || item.created).getFullYear();
            return itemYear === year;
        });
    }
}

// Export for use in other modules
window.DataTransformer = DataTransformer;
