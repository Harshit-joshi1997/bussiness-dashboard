
import { useStore } from '../store/useStore';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import SpendingBreakdownChart from '../components/dashboard/SpendingBreakdownChart';
import TransactionsList from '../components/dashboard/TransactionsList';
import Insights from '../components/dashboard/Insights';

export default function Dashboard() {
  const user = useStore((state) => state.user);
  
  return (
    <div className="space-y-8 pb-12 flex flex-col w-full">
      <header>
        <h1 className="text-3xl font-bold dark:text-white mb-2">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome back, {user?.name}. Here's your financial overview.</p>
      </header>

      <SummaryCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[400px] lg:h-full">
          <BalanceTrendChart />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[400px] lg:h-full">
          <SpendingBreakdownChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full flex flex-col">
          <TransactionsList />
        </div>
        <div className="h-full flex flex-col">
          <Insights />
        </div>
      </div>
    </div>
  );
}
