import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';

const YearFilter = ({ selectedYears, onChange }) => {
    const currentYear = new Date().getFullYear();
    const [isOpen, setIsOpen] = useState(false);
    const [years, setYears] = useState([]);

    useEffect(() => {
        // Generate year range: current year ± 5 years
        const yearList = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            yearList.push(i);
        }
        setYears(yearList);

        // Set default to current year if no selection
        if (!selectedYears || selectedYears.length === 0) {
            onChange([currentYear]);
        }
    }, []);

    const toggleYear = (year) => {
        const newSelection = selectedYears.includes(year)
            ? selectedYears.filter(y => y !== year)
            : [...selectedYears, year].sort((a, b) => a - b);

        // Always keep at least one year selected
        if (newSelection.length > 0) {
            onChange(newSelection);
        }
    };

    const clearAll = () => {
        onChange([currentYear]);
    };

    const selectAll = () => {
        onChange(years);
    };

    const getDisplayText = () => {
        if (!selectedYears || selectedYears.length === 0) return currentYear.toString();
        if (selectedYears.length === 1) return selectedYears[0].toString();
        if (selectedYears.length === years.length) return 'All Years';

        const sorted = [...selectedYears].sort((a, b) => a - b);
        return `${sorted[0]} - ${sorted[sorted.length - 1]} (${selectedYears.length})`;
    };

    return (
        <div className="year-filter">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn bg-bg-secondary hover:bg-bg-primary border border-border-color"
            >
                <FaCalendarAlt />
                <span>{getDisplayText()}</span>
            </button>

            {isOpen && (
                <>
                    <div className="year-filter-overlay" onClick={() => setIsOpen(false)} />
                    <div className="year-filter-dropdown">
                        <div className="year-filter-header">
                            <h4>Select Years</h4>
                            <button onClick={() => setIsOpen(false)} className="btn-icon">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="year-filter-actions">
                            <button onClick={selectAll} className="btn-link">Select All</button>
                            <button onClick={clearAll} className="btn-link">Clear</button>
                        </div>

                        <div className="year-filter-grid">
                            {years.map(year => (
                                <button
                                    key={year}
                                    onClick={() => toggleYear(year)}
                                    className={`year-button ${selectedYears.includes(year) ? 'selected' : ''} ${year === currentYear ? 'current' : ''}`}
                                >
                                    {year}
                                    {year === currentYear && <span className="current-badge">Now</span>}
                                </button>
                            ))}
                        </div>

                        <div className="year-filter-footer">
                            <span className="text-sm text-muted">
                                {selectedYears.length} year{selectedYears.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .year-filter {
                    position: relative;
                }

                .year-filter-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 999;
                }

                .year-filter-dropdown {
                    position: absolute;
                    top: calc(100% + 0.5rem);
                    right: 0;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    z-index: 1000;
                    min-width: 320px;
                    max-width: 400px;
                }

                @media (max-width: 768px) {
                    .year-filter-dropdown {
                        right: auto;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 90vw;
                        min-width: auto;
                    }
                }

                .year-filter-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .year-filter-header h4 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .btn-icon {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-icon:hover {
                    color: var(--text-primary);
                }

                .year-filter-actions {
                    display: flex;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .btn-link {
                    background: none;
                    border: none;
                    color: var(--accent-color);
                    cursor: pointer;
                    font-size: 0.875rem;
                    padding: 0;
                }

                .btn-link:hover {
                    color: var(--accent-hover);
                    text-decoration: underline;
                }

                .year-filter-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    padding: 1rem;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .year-button {
                    position: relative;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-card);
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .year-button:hover {
                    background: var(--card-hover);
                    border-color: var(--accent-color);
                }

                .year-button.selected {
                    background: var(--accent-color);
                    color: #0f172a;
                    border-color: var(--accent-color);
                }

                .year-button.current {
                    border-width: 2px;
                }

                .current-badge {
                    position: absolute;
                    top: -0.5rem;
                    right: -0.5rem;
                    background: var(--success-color);
                    color: white;
                    font-size: 0.625rem;
                    padding: 0.125rem 0.375rem;
                    border-radius: 9999px;
                    font-weight: 600;
                }

                .year-filter-footer {
                    padding: 0.75rem 1rem;
                    border-top: 1px solid var(--border-color);
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default YearFilter;
