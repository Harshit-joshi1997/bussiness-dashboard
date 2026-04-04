import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Lightbulb, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function Insights() {
  const transactions = useStore((state) => state.transactions);

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    // Group by category for expenses
    const categories = expenses.reduce((acc, current) => {
      acc[current.category] = (acc[current.category] || 0) + current.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const highestCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;

    return [
      {
        id: 1,
        title: 'Top Expense Category',
        desc: highestCategory 
          ? `You spent $${highestCategory[1]} on ${highestCategory[0]} this period.`
          : 'Not enough data to calculate top expense.',
        icon: AlertCircle,
        color: 'text-amber-500'
      },
      {
        id: 2,
        title: 'Monthly Insight',
        desc: income.length > expenses.length 
          ? 'Great job! You have more income transactions than expenses.'
          : 'Watch out! You have frequent expense transactions.',
        icon: Lightbulb,
        color: 'text-indigo-500'
      }
    ];
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-semibold mb-6 dark:text-zinc-50 flex items-center gap-2">
        <ArrowUpRight className="text-zinc-400" />
        Financial Insights
      </h3>
      <div className="space-y-6">
        {insights.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="mt-1">
              <item.icon className={item.color} size={24} />
            </div>
            <div>
              <h4 className="font-medium dark:text-zinc-200">{item.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
