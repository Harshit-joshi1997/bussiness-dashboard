import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Wallet, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      // Create a mock name from the email
      const mockedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'User';
      const formattedName = mockedName.charAt(0).toUpperCase() + mockedName.slice(1);
      
      login(formattedName, email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">
      {/* Visual / Motion Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-20"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="mb-8"
          >
            <Wallet size={120} className="text-indigo-400 opacity-80" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Zorvyn Finance</h1>
          <p className="text-zinc-400 text-lg max-w-md">
            Master your money with our intelligent dashboard. Track, analyze, and optimize your spending with stunning visualizations.
          </p>
        </motion.div>

        {/* Floating background elements */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-[0.02]"
            initial={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              x: Math.random() * 1000 - 500,
              y: Math.random() * 1000 - 500,
            }}
            animate={{
              x: Math.random() * 1000 - 500,
              y: Math.random() * 1000 - 500,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Wallet size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Zorvyn</h1>
          </div>
          
          <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">Enter your details to access your dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              Access Dashboard
              <ArrowRight size={20} />
            </motion.button>
            
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Register
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
