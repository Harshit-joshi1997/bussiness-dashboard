import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Search, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function TransactionsList() {
  const transactions = useStore((state) => state.transactions);
  const user = useStore((state) => state.user);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredAndSortedData = useMemo(() => {
    const relevantTransactions = user?.role === 'staff' 
      ? transactions.filter(t => t.createdBy === user.email) 
      : transactions;

    let data = [...relevantTransactions];

    if (filterType !== 'all') {
      data = data.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      data = data.filter(t => 
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.amount.toString().includes(searchTerm)
      );
    }

    data.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [transactions, searchTerm, filterType, sortOrder, user]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold dark:text-zinc-50">Transactions</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by category or amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center shrink-0"
            title="Sort by date"
          >
            {sortOrder === 'desc' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredAndSortedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">No transactions found matching your criteria.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                {user?.role === 'admin' && <th className="pb-3 font-medium text-right w-16"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredAndSortedData.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 text-zinc-900 dark:text-zinc-300">
                    {new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4 font-medium dark:text-zinc-100">{t.category}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      t.type === 'income' ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" 
                      : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
                    )}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td className={cn(
                    "py-4 text-right font-medium",
                    t.type === 'income' ? "text-emerald-600 dark:text-emerald-500" : "text-zinc-900 dark:text-zinc-100"
                  )}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  {user?.role === 'admin' && (
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
