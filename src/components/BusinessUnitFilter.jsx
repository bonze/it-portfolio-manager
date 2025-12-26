import React, { useState, useMemo } from 'react';
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

    return (
        <div className="bu-filter relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`btn bg-bg-secondary hover:bg-bg-primary border border-border-color flex items-center gap-2 ${!isAllSelected ? 'text-accent-color border-accent-color' : ''}`}
            >
                <FaBuilding />
                <span className="hidden md:inline">{getDisplayText()}</span>
                {!isAllSelected && <span className="md:hidden">BU</span>}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop - Fixed for both mobile and desktop to ensure click-outside works, added blur and dim */}
                    <div
                        className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm"
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
                        md:w-64 md:max-h-[600px]
                        ${align === 'right' ? 'md:right-0' : 'md:left-0'} 
                        ${align === 'responsive' ? 'md:right-0' : ''}
                    `}>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-border-color px-2 pt-2">
                            <span className="font-semibold text-sm">Filter Business Unit</span>
                            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-text-primary p-1">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-2 space-y-1">
                            <button
                                onClick={selectAll}
                                className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center hover:bg-bg-primary ${isAllSelected ? 'bg-accent-color text-white' : ''}`}
                            >
                                <span>All Business Units</span>
                                {isAllSelected && <FaCheck size={10} />}
                            </button>

                            {businessUnits.map(bu => {
                                const isSelected = selectedBUs.includes(bu);
                                return (
                                    <button
                                        key={bu}
                                        onClick={() => toggleBU(bu)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center hover:bg-bg-primary ${isSelected ? 'bg-accent-color/10 text-accent-color font-medium' : ''}`}
                                    >
                                        <span>{bu}</span>
                                        {isSelected && <FaCheck size={10} />}
                                    </button>
                                );
                            })}

                            {businessUnits.length === 0 && (
                                <div className="text-center text-muted text-xs py-4">No Business Units found</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BusinessUnitFilter;
