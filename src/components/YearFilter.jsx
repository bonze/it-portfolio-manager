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

    // Lock body scroll when open (both mobile and desktop)
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    return (
        <div className="year-filter relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`btn bg-bg-secondary hover:bg-bg-primary border border-border-color flex items-center gap-2 transition-all ${selectedYears.length > 0 ? 'text-accent-color border-accent-color ring-1 ring-accent-color/20' : ''}`}
            >
                <FaCalendarAlt className={selectedYears.length > 0 ? 'text-accent-color' : 'text-text-muted'} />
                <span className="font-medium">{getDisplayText()}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown/Modal Container */}
                    <div className={`
                        bg-bg-secondary border border-border-color rounded-xl shadow-2xl 
                        z-[1001] flex flex-col overflow-hidden pointer-events-auto
                        
                        /* Mobile: Fixed Centered Modal */
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[90vw] max-w-sm h-auto max-h-[80vh]
                        
                        /* Desktop: Absolute Dropdown */
                        md:absolute md:top-full md:left-auto md:translate-x-0 md:translate-y-0 md:mt-2 
                        md:w-[320px] md:max-h-[450px]
                        ${align === 'right' ? 'md:right-0' : 'md:left-0'} 
                        ${align === 'responsive' ? 'md:right-0' : ''}
                    `}>
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-border-color bg-bg-primary/50 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-accent-color" />
                                <span className="font-bold text-text-primary">Select Years</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-bg-primary rounded-full transition-colors text-text-muted hover:text-text-primary"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="p-3 border-b border-border-color bg-bg-secondary flex gap-2 flex-shrink-0">
                            <button
                                onClick={selectAll}
                                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-bg-primary text-text-primary hover:bg-bg-primary/80 border border-border-color transition-all"
                            >
                                Select All
                            </button>
                            <button
                                onClick={clearAll}
                                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-bg-primary text-text-primary hover:bg-bg-primary/80 border border-border-color transition-all"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Scrollable Grid */}
                        <div className="overflow-y-auto overscroll-y-contain p-4 flex-grow min-h-0 custom-scrollbar" style={{ touchAction: 'pan-y' }}>
                            <div className="grid grid-cols-3 gap-3">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => toggleYear(year)}
                                        className={`
                                            relative py-3 px-2 rounded-xl text-sm font-bold transition-all
                                            ${selectedYears.includes(year)
                                                ? 'bg-accent-color text-white shadow-lg shadow-accent-color/20 scale-[1.02]'
                                                : 'bg-bg-primary text-text-primary hover:bg-bg-primary/80 border border-border-color'}
                                            ${year === currentYear ? 'ring-2 ring-success-color ring-offset-2 ring-offset-bg-secondary' : ''}
                                        `}
                                    >
                                        {year}
                                        {year === currentYear && (
                                            <span className="absolute -top-2 -right-1 bg-success-color text-[8px] text-white px-1.5 py-0.5 rounded-full shadow-sm">
                                                NOW
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border-color bg-bg-primary/30 flex-shrink-0">
                            <div className="flex justify-between items-center mb-3 px-1">
                                <span className="text-xs text-text-muted font-medium">Selected</span>
                                <span className="text-xs font-bold text-accent-color bg-accent-color/10 px-2 py-0.5 rounded-full">
                                    {selectedYears.length} Year{selectedYears.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-accent-color hover:bg-accent-hover text-white rounded-xl font-bold text-sm shadow-lg shadow-accent-color/20 transition-all active:scale-[0.98]"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default YearFilter;
