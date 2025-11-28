import React from 'react';

const MetricCard = ({ label, value, icon: Icon, color = 'accent', subtitle }) => {
    const colorClasses = {
        accent: 'text-accent-color',
        success: 'text-success-color',
        warning: 'text-warning-color',
        error: 'text-error-color',
        primary: 'text-text-primary'
    };

    return (
        <div className="card p-4 flex flex-col gap-2 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 text-muted text-sm">
                {Icon && <Icon className={colorClasses[color]} />}
                <span>{label}</span>
            </div>
            <div className={`text-3xl font-bold ${colorClasses[color]}`}>
                {value}
            </div>
            {subtitle && (
                <div className="text-xs text-muted mt-1">
                    {subtitle}
                </div>
            )}
        </div>
    );
};

export default MetricCard;
