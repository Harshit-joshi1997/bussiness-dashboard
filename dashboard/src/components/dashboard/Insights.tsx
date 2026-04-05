import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Lightbulb, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function Insights() {
  const transactions = useStore((state) => state.transactions);

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : '0.0';
    const isNegative = totalExpenses > totalIncome;

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
          ? `You spent $${highestCategory[1].toLocaleString()} on ${highestCategory[0]} this period.`
          : 'No expense data available yet.',
        icon: AlertCircle,
        color: 'text-amber-500'
      },
      {
        id: 2,
        title: 'Monthly Insight',
        desc: isNegative
          ? `Your expenses ($${totalExpenses.toLocaleString()}) exceed your income ($${totalIncome.toLocaleString()}) by $${(totalExpenses - totalIncome).toLocaleString()}. Consider reducing spending.`
          : `You're in the green! Income exceeds expenses by $${(totalIncome - totalExpenses).toLocaleString()}.`,
        icon: Lightbulb,
        color: isNegative ? 'text-red-500' : 'text-indigo-500'
      },
      {
        id: 3,
        title: 'Savings Rate',
        desc: isNegative
          ? `Savings rate is ${savingsRate}%. You are spending more than you earn this period.`
          : `You are saving ${savingsRate}% of your income this period. Keep it up!`,
        icon: ArrowUpRight,
        color: isNegative ? 'text-red-500' : 'text-emerald-500'
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
