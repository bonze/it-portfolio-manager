import React from 'react';

const ProgressBar = ({ percentage }) => {
    // Determine color based on percentage
    let color = 'var(--accent-color)';
    if (percentage >= 100) color = 'var(--success-color)';
    else if (percentage < 30) color = 'var(--warning-color)';

    return (
        <div className="flex items-center gap-2" style={{ width: '100%' }}>
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-sm text-muted" style={{ minWidth: '3ch' }}>{percentage}%</span>
        </div>
    );
};

export default ProgressBar;
