import { useState } from 'react';
import { useStore } from '../store/useStore';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function Settings() {
  const user = useStore((state) => state.user);
  const hardReset = useStore((state) => state.hardReset);
  const [resetMessage, setResetMessage] = useState('');

  if (user?.role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto text-red-500 mb-4 opacity-50" />
          <h2 className="text-2xl font-bold dark:text-white mb-2">Access Denied</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Settings are restricted to administrators.</p>
        </div>
      </div>
    );
  }

  const handleHardReset = () => {
    const confirmation = window.confirm(
      "WARNING: This will permanently delete ALL transactions for all users in the system.\n\nAre you absolutely sure you want to proceed?"
    );
    if (confirmation) {
      hardReset();
      setResetMessage("All transactions have been deleted successfully.");
      setTimeout(() => setResetMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold dark:text-white mb-2">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage global system configurations.</p>
      </header>

      {resetMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg">
          {resetMessage}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle size={20} />
          Danger Zone
        </h2>

        <div className="border border-red-200 dark:border-red-900/50 rounded-lg p-5 bg-red-50/50 dark:bg-red-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">Hard Reset System Data</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Permanently delete all transaction records across the entire application. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handleHardReset}
            className="shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Hard Reset
          </button>
        </div>
      </div>
    </div>
  );
}
