import React, { useState, useEffect, useMemo } from 'react';
import { FaBuilding, FaTimes, FaCheck } from 'react-icons/fa';

const BusinessUnitFilter = ({ projects, selectedBUs, onChange, align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Extract unique Business Units
    const businessUnits = useMemo(() => {
        const units = new Set(projects.map(p => p.businessUnit).filter(Boolean));
        return Array.from(units).sort();
    }, [projects]);

    // Initialize with all BUs if selection is empty (optional, or handle "All" logic in parent)
    // But usually filters start with "All" (empty selection implies all or explicit all)
    // Let's assume empty array = All

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
                    <div className="fixed inset-0 z-[998]" onClick={() => setIsOpen(false)} />
                    <div className={`absolute top-full mt-2 z-[999] bg-bg-secondary border border-border-color rounded-lg shadow-lg w-64 p-2 ${align === 'right' ? 'right-0' : 'left-0'} ${align === 'responsive' ? 'left-0 md:left-auto md:right-0' : ''}`}>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-border-color px-2">
                            <span className="font-semibold text-sm">Filter Business Unit</span>
                            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-text-primary">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-1">
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
