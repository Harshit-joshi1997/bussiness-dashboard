import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! I am your AlphaX AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to global state to send real context to AI
  const transactions = useStore(state => state.transactions);
  const getSummary = useStore(state => state.getSummary);
  const user = useStore(state => state.user);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMsg.content,
          dashboardData: {
            user: { name: user?.name, role: user?.role },
            financialSummary: getSummary(user?.role === 'staff' ? user.email : undefined),
            recentTransactions: transactions.slice(0, 30) // Only send recent 30 to save context limits
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.aiResponse
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, I am having trouble connecting to the server. Please ensure your backend is running and OPENAI_API_KEY is set in your .env file.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto pb-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white mb-2 flex items-center gap-2">
          <Bot className="text-indigo-600 dark:text-indigo-400" size={32} />
          AI Assistant
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">Ask questions about your finances, transactions, and team.</p>
      </header>

      <div className="flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm min-h-0">

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] gap-1.5",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-1">
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                <span className="text-xs uppercase font-bold tracking-wider">{msg.role}</span>
              </div>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl leading-relaxed text-sm shadow-sm",
                  msg.role === 'user'
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex flex-col max-w-[85%] gap-1.5 mr-auto items-start">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-1">
                <Bot size={14} />
                <span className="text-xs uppercase font-bold tracking-wider">AI</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full pl-4 pr-12 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
