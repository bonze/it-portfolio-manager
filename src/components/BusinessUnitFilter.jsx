import React, { useState, useMemo, useEffect } from 'react';
import { FaBuilding, FaTimes, FaCheck } from 'react-icons/fa';

const BusinessUnitFilter = ({ projects, selectedBUs, onChange, align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Extract unique Business Units
    const businessUnits = useMemo(() => {
        const units = new Set(projects.map(p => p.businessUnit).filter(Boolean));
        return Array.from(units).sort();
    }, [projects]);

    const toggleBU = (bu) => {
        const newSelection = selectedBUs.includes(bu)
            ? selectedBUs.filter(b => b !== bu)
            : [...selectedBUs, bu];
        onChange(newSelection);
    };

    const selectAll = () => {
        onChange([]); // Empty means all
    };

    const isAllSelected = selectedBUs.length === 0;

    const getDisplayText = () => {
        if (isAllSelected) return 'All Units';
        if (selectedBUs.length === 1) return selectedBUs[0];
        return `${selectedBUs.length} Units`;
    };

    // Robust Scroll Lock
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalHTMLOverflow = document.documentElement.style.overflow;

            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'; // Prevent layout shift

            return () => {
                document.body.style.overflow = originalOverflow;
                document.documentElement.style.overflow = originalHTMLOverflow;
                document.body.style.paddingRight = '0px';
            };
        }
    }, [isOpen]);

    return (
        <div className="bu-filter relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`btn bg-bg-secondary hover:bg-bg-primary border border-border-color flex items-center gap-2 transition-all ${!isAllSelected ? 'text-accent-color border-accent-color ring-1 ring-accent-color/20' : ''}`}
            >
                <FaBuilding className={!isAllSelected ? 'text-accent-color' : 'text-text-muted'} />
                <span className="hidden md:inline font-medium">{getDisplayText()}</span>
                {!isAllSelected && <span className="md:hidden font-medium">BU</span>}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop - Fixed to cover everything */}
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
                        w-[90vw] max-w-sm h-auto max-h-[85vh]
                        
                        /* Desktop: Absolute Dropdown */
                        md:absolute md:top-full md:mt-2 md:w-80
                        md:left-auto md:right-auto md:bottom-auto
                        md:translate-x-0 md:translate-y-0
                        ${align === 'right' ? 'md:right-0 md:left-auto' : 'md:left-0 md:right-auto'}
                    `}>
                        {/* Header - Fixed Height */}
                        <div className="flex justify-between items-center p-4 border-b border-border-color bg-bg-primary/50 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <FaBuilding className="text-accent-color" />
                                <span className="font-bold text-text-primary">Business Units</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-bg-primary rounded-full transition-colors text-text-muted hover:text-text-primary"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Actions - Fixed Height */}
                        <div className="p-3 border-b border-border-color bg-bg-secondary flex-shrink-0">
                            <button
                                onClick={selectAll}
                                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${isAllSelected ? 'bg-accent-color text-white shadow-lg shadow-accent-color/20' : 'bg-bg-primary text-text-primary hover:bg-bg-primary/80 border border-border-color'}`}
                            >
                                <span>All Business Units</span>
                                {isAllSelected && <FaCheck size={12} />}
                            </button>
                        </div>

                        {/* Scrollable List - Explicit Max Height to force scrollbar */}
                        <div
                            className="overflow-y-auto overscroll-contain p-2 space-y-1 flex-grow custom-scrollbar"
                            style={{
                                maxHeight: 'min(400px, 50vh)',
                                touchAction: 'pan-y',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {businessUnits.map(bu => {
                                const isSelected = selectedBUs.includes(bu);
                                return (
                                    <button
                                        key={bu}
                                        onClick={() => toggleBU(bu)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between items-center transition-all group ${isSelected ? 'bg-accent-color/10 text-accent-color font-semibold border border-accent-color/20' : 'text-text-primary hover:bg-bg-primary border border-transparent'}`}
                                    >
                                        <span className="truncate pr-2">{bu}</span>
                                        {isSelected && <FaCheck size={12} className="flex-shrink-0" />}
                                    </button>
                                );
                            })}

                            {businessUnits.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                                    <FaBuilding size={32} className="opacity-20 mb-2" />
                                    <p className="text-xs">No Business Units found</p>
                                </div>
                            )}
                        </div>

                        {/* Footer - Fixed Height */}
                        <div className="p-3 border-t border-border-color bg-bg-primary/30 flex-shrink-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-2.5 bg-accent-color hover:bg-accent-hover text-white rounded-lg font-bold text-sm shadow-lg shadow-accent-color/20 transition-all active:scale-[0.98]"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                    background-clip: content-box;
                }
            `}</style>
        </div>
    );
};

export default BusinessUnitFilter;
