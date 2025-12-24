/**
 * Format a date string or Date object to MM/DD/YYYY format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string in MM/DD/YYYY format, or empty string if invalid
 */
export const formatDate = (date) => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
};

/**
 * Convert MM/DD/YYYY format to YYYY-MM-DD format for input fields
 * @param {string} dateStr - Date string in MM/DD/YYYY format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const toInputFormat = (dateStr) => {
    if (!dateStr) return '';

    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    // Parse MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Try to parse as date
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Convert YYYY-MM-DD format to MM/DD/YYYY format
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Date string in MM/DD/YYYY format
 */
export const fromInputFormat = (dateStr) => {
    if (!dateStr) return '';

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';

    return formatDate(d);
};
