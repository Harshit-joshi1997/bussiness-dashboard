import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStore } from '../../store/useStore';
import { useThemeStore } from '../../store/themeStore';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export default function SpendingBreakdownChart() {
  const transactions = useStore((state) => state.transactions);
  const theme = useThemeStore((state) => state.theme);

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = expenses.reduce((acc, current) => {
      acc[current.category] = (acc[current.category] || 0) + current.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2 dark:text-zinc-100">Spending by Category</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${Number(value).toLocaleString()}`}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                borderColor: theme === 'dark' ? '#27272a' : '#e5e7eb',
                color: theme === 'dark' ? '#f4f4f5' : '#18181b',
                borderRadius: '8px'
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
