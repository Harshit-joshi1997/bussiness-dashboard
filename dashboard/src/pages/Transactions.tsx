import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { TransactionType } from '../store/useStore';
import TransactionsList from '../components/dashboard/TransactionsList';
import { PlusCircle, X } from 'lucide-react';

const CATEGORIES = [
  'Salary', 'Freelance', 'Groceries', 'Transport', 'Utilities',
  'Entertainment', 'Healthcare', 'Education', 'Marketing', 'Operations',
  'Development', 'Other',
];

export default function Transactions() {
  const user = useStore((state) => state.user);
  const employees = useStore((state) => state.employees);
  const addTransaction = useStore((state) => state.addTransaction);

  const isAdmin = user?.role === 'admin';
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    date: today,
    category: 'Salary',
    type: 'income' as TransactionType,
    amount: '',
    createdBy: user?.email ?? '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.date) return setError('Please pick a date.');
    if (isNaN(amount) || amount <= 0) return setError('Please enter a valid positive amount.');

    addTransaction({
      date: form.date,
      category: form.category,
      type: form.type,
      amount,
      createdBy: form.createdBy || user?.email,
    });

    setForm({ date: today, category: 'Salary', type: 'income', amount: '', createdBy: user?.email ?? '' });
    setError('');
    setSuccess('Transaction added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold dark:text-white mb-2">Transactions</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Add and manage all your financial records.</p>
      </header>

      {/* Add Transaction Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold dark:text-zinc-100 mb-5 flex items-center gap-2">
          <PlusCircle size={20} className="text-indigo-500" />
          Add New Transaction
        </h2>

        {error && (
          <div className="mb-4 flex items-center justify-between bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg px-4 py-3 text-sm">
            {error}
            <button onClick={() => setError('')}><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Employee */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Employee</label>
            {isAdmin ? (
              <select
                value={form.createdBy}
                onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
                className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {employees.map((emp) => (
                  <option key={emp.email} value={emp.email}>
                    {emp.name ? `${emp.name} (${emp.email})` : emp.email}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm">
                {user?.name || user?.email}
              </div>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
            <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'income' })}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${form.type === 'income'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'expense' })}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${form.type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Submit — full width */}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg font-medium transition-all text-sm flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Add Transaction
            </button>
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <TransactionsList />
    </div>
  );
}

