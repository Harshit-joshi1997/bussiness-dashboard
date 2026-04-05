import { useStore } from '../../store/useStore';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SummaryCards() {
  const user = useStore((state) => state.user);
  const getSummary = useStore((state) => state.getSummary);
  const { totalBalance, totalIncome, totalExpenses } = getSummary(user?.role === 'staff' ? user.email : undefined);

  const cards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: DollarSign,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-500/20',
      trend: '+2.5%',
      isPositive: true,
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-500/20',
      trend: '+12.5%',
      isPositive: true,
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-500/20',
      trend: '-4.1%',
      isPositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium">{card.title}</h3>
            <div className={cn('p-3 rounded-xl', card.bg, card.color)}>
              <card.icon size={24} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold dark:text-zinc-50">
                ${card.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded-md",
              card.isPositive ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
            )}>
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
