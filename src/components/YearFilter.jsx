import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';

const YearFilter = ({ selectedYears, onChange, align = 'right' }) => {
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

    // Lock body scroll on mobile when open
    useEffect(() => {
        if (isOpen) {
            if (window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="year-filter relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn bg-bg-secondary hover:bg-bg-primary border border-border-color flex items-center gap-2"
            >
                <FaCalendarAlt />
                <span>{getDisplayText()}</span>
            </button>

            {isOpen && (
                <>
                    {/* Mobile Backdrop - Only visible on mobile */}
                    <div
                        className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Desktop Transparent Backdrop - To close dropdown when clicking outside */}
                    <div
                        className="fixed inset-0 z-[998] hidden md:block"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown/Modal Container */}
                    <div className={`
                        bg-bg-secondary border border-border-color rounded-lg shadow-xl 
                        z-[1001] flex flex-col
                        
                        /* Mobile: Fixed Centered Modal */
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[90vw] max-w-sm max-h-[80vh]
                        
                        /* Desktop: Absolute Dropdown */
                        md:absolute md:top-full md:left-auto md:translate-x-0 md:translate-y-0 md:mt-2 
                        md:w-[320px] md:max-h-[400px]
                        ${align === 'right' ? 'md:right-0' : 'md:left-0'} 
                        ${align === 'responsive' ? 'md:right-0' : ''}
                    `}>
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

                        <div className="year-filter-grid overscroll-y-contain">
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
