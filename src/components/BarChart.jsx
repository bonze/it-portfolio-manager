import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BarChartComponent = ({ data, title, valueFormatter = (v) => v, showPercentage = false }) => {
    // data: [{ label, value, completion? }]

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];

    // Transform data for Recharts
    const chartData = data.map((item, index) => ({
        name: item.label.length > 20 ? item.label.substring(0, 20) + '...' : item.label,
        value: item.value,
        completion: item.completion,
        fill: COLORS[index % COLORS.length]
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-bg-card p-3 rounded border border-border-color">
                    <p className="text-text-primary font-semibold">{payload[0].payload.name}</p>
                    <p className="text-accent-color">{valueFormatter(payload[0].value)}</p>
                    {showPercentage && payload[0].payload.completion !== undefined && (
                        <p className="text-muted text-sm">Completion: {payload[0].payload.completion}%</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card p-4">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={Math.max(300, data.length * 40)}>
                <RechartsBar data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={150} stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </RechartsBar>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
