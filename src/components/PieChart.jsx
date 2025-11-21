import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PieChartComponent = ({ data, title }) => {
    // data: [{ label, value }]
    const COLORS = [
        '#3b82f6', // Blue
        '#10b981', // Green  
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#f97316', // Orange
        '#06b6d4', // Cyan
        '#ec4899'  // Pink
    ];

    // Transform data for Recharts
    const chartData = data.map((item, index) => ({
        name: item.label,
        value: item.value,
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <div className="card p-4">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                </RechartsPie>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
