import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
  type: TransactionType;
  createdBy?: string; // Used to track which staff member created the transaction
}

export interface User {
  name?: string;
  email: string;
  password: string;
  role?: 'admin' | 'staff';
  phone?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  employees: User[];
  transactions: Transaction[];
  login: (email: string, password: string) => boolean;
  register: (user: User) => void;
  logout: () => void;
  // Data actions
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getSummary: (filterByEmail?: string) => { totalBalance: number; totalIncome: number; totalExpenses: number };
  // Admin actions
  addEmployee: (user: User) => void;
  removeEmployee: (email: string) => void;
  updateEmployeeRole: (email: string, role: 'admin' | 'staff') => void;
  updateEmployee: (email: string, data: Partial<User>) => void;
  hardReset: () => void;
}

// Initial mock data
const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 5000, category: 'Salary', type: 'income', createdBy: 'admin@zorvyn.com' },
  { id: '2', date: '2026-04-02', amount: 1500, category: 'Freelance', type: 'income', createdBy: 'admin@zorvyn.com' },
  { id: '3', date: '2026-04-02', amount: 120, category: 'Groceries', type: 'expense', createdBy: 'admin@zorvyn.com' },
  { id: '4', date: '2026-04-03', amount: 60, category: 'Transport', type: 'expense', createdBy: 'admin@zorvyn.com' },
];

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        isAuthenticated: false,
        user: null,
        employees: [
          // Create a default admin account
          { name: 'Admin User', email: 'admin@zorvyn.com', password: 'password', role: 'admin' }
        ],
        transactions: initialTransactions,

        register: (user: User) =>
          set((state) => {
            const currentEmployees = state.employees || [];
            const isFirstUser = currentEmployees.length === 0;
            const role = user.role || (isFirstUser ? 'admin' : 'staff');
            const newUser = { ...user, role };
            return {
              employees: [...currentEmployees, newUser],
              user: newUser,
              isAuthenticated: false,
            };
          }),

        login: (email, password) => {
          const state = get();
          const currentEmployees = state.employees || [];
          const foundUser = currentEmployees.find(u => u.email === email && u.password === password);
          // Fallback to match if they just registered and their state.user is the only reference
          const legacyMatch = state.user?.email === email && state.user?.password === password;

          if (foundUser) {
            set({ isAuthenticated: true, user: foundUser });
            return true;
          } else if (legacyMatch && state.user) {
            // Migrate user to employees
            const newUser = { ...state.user, role: state.user.role || 'staff' };
            set({ isAuthenticated: true, user: newUser, employees: [...currentEmployees, newUser] });
            return true;
          }
          return false;
        },

        logout: () => set({ isAuthenticated: false, user: null }),

        addTransaction: (t) =>
          set((state) => ({
            transactions: [{ ...t, id: Math.random().toString(36).substring(7) }, ...state.transactions],
          })),

        deleteTransaction: (id) =>
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          })),

        getSummary: (filterByEmail?: string) => {
          const { transactions } = get();
          let totalIncome = 0;
          let totalExpenses = 0;

          transactions.forEach((t) => {
            if (filterByEmail && t.createdBy !== filterByEmail) return;
            if (t.type === 'income') totalIncome += t.amount;
            else totalExpenses += t.amount;
          });

          return {
            totalIncome,
            totalExpenses,
            totalBalance: totalIncome - totalExpenses,
          };
        },

        addEmployee: (newUser) =>
          set((state) => ({ employees: [...state.employees, newUser] })),

        removeEmployee: (email) =>
          set((state) => ({ employees: state.employees.filter((u) => u.email !== email) })),

        updateEmployeeRole: (email, role) =>
          set((state) => ({
            employees: state.employees.map((u) => (u.email === email ? { ...u, role } : u)),
            // If the updated user is currenlty logged in, update their local cache
            user: state.user?.email === email ? { ...state.user, role } : state.user,
          })),

        updateEmployee: (email, data) =>
          set((state) => ({
            employees: state.employees.map((u) => (u.email === email ? { ...u, ...data } : u)),
            user: state.user?.email === email ? { ...state.user, ...data } : state.user,
          })),

        hardReset: () =>
          set({ transactions: [] }),

      }),
      {
        name: 'dashboard-storage',
      }
    )
  )
);
