import { create } from 'zustand';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  type: TransactionType;
}

interface User {
  email: string;
  password: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  transactions: Transaction[];
  login: (email: string, password: string) => void;
  register: (user: User) => void;
  logout: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getSummary: () => { totalBalance: number; totalIncome: number; totalExpenses: number };
}

// Initial mock data
const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income' },
  { id: '2', date: '2026-04-02', amount: 1500, category: 'Freelance', type: 'income' },
  { id: '3', date: '2026-04-02', amount: 120, category: 'Groceries', type: 'expense' },
  { id: '4', date: '2026-04-03', amount: 60, category: 'Transport', type: 'expense' },
  { id: '5', date: '2026-04-04', amount: 200, category: 'Utilities', type: 'expense' },
  { id: '6', date: '2026-03-28', amount: 300, category: 'Dining', type: 'expense' },
  { id: '7', date: '2026-03-29', amount: 50, category: 'Subscriptions', type: 'expense' },
];

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  transactions: initialTransactions,

  register: (User: User) =>
    set({
      user: User,
      isAuthenticated: false,
    }),



  login: (email, password) => set((state) => {
    if (state.user?.email === email && state.user?.password === password) {
      return { isAuthenticated: true, user: { email, password } };
    }
    return state;
  }),
  logout: () => set({ isAuthenticated: false, user: null }),

  addTransaction: (t) =>
    set((state) => ({
      transactions: [{ ...t, id: Math.random().toString(36).substring(7) }, ...state.transactions],
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  getSummary: () => {
    const { transactions } = get();
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpenses += t.amount;
    });

    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
    };
  },
}));
