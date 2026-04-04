import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';
import { useThemeStore } from '../../store/themeStore';

export default function BalanceTrendChart() {
  const transactions = useStore((state) => state.transactions);
  const theme = useThemeStore((state) => state.theme);

  const data = useMemo(() => {
    // Generate simple cumulative data or group by date
    // Sort transactions by date ascending
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let balance = 0;
    return sorted.map(t => {
      balance += t.type === 'income' ? t.amount : -t.amount;
      return {
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance
      };
    });
  }, [transactions]);

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#27272a' : '#e5e7eb';

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-6 dark:text-zinc-100">Balance Trend</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                borderColor: theme === 'dark' ? '#27272a' : '#e5e7eb',
                color: theme === 'dark' ? '#f4f4f5' : '#18181b',
                borderRadius: '8px'
              }}
              itemStyle={{ color: '#6366f1' }}
            />
            <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
