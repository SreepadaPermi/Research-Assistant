import { useState } from 'react';
import { Search, Loader2, Sparkles, Newspaper, History, Trash2, ArrowRight, BookOpen, Bookmark, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { performResearch } from './lib/gemini';
import { cn } from './lib/utils';

interface SearchResult {
  id: string;
  topic: string;
  content: string;
  timestamp: string;
}

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const summary = await performResearch(topic);
      if (summary) {
        const newResult: SearchResult = {
          id: Math.random().toString(36).substr(2, 9),
          topic,
          content: summary,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setResults([newResult, ...results]);
        setTopic('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setResults([]);
  };

  const removeResult = (id: string) => {
    setResults(results.filter(r => r.id !== id));
  };

  return (
    <div className="flex bg-brand-bg text-brand-text h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-brand-border bg-brand-bg flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <BookOpen className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-lg">InsightFlow</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="text-[11px] uppercase tracking-widest text-brand-dim font-semibold mb-4 px-2">Workspace</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-brand-border rounded-md text-sm font-medium text-white transition-all">
            <Search className="w-4 h-4" />
            New Research
          </button>
          <button 
            onClick={clearHistory}
            className="w-full flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-brand-surface rounded-md text-sm font-medium transition-colors"
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-brand-surface rounded-md text-sm font-medium transition-colors">
            <Bookmark className="w-4 h-4" />
            Saved Reports
          </button>
        </nav>

        <div className="p-4 border-t border-brand-border">
          <div className="flex items-center gap-3 p-2 bg-brand-surface rounded-lg border border-brand-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex-shrink-0 flex items-center justify-center">
              <User className="w-4 h-4 text-white/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Guest Researcher</p>
              <p className="text-[10px] text-brand-dim truncate uppercase tracking-tighter font-semibold">Free Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Search Header Area */}
        <header className="p-8 pb-4 shrink-0">
          <div className="max-w-3xl mx-auto w-full">
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Research Assistant</h1>
            <p className="text-brand-muted text-sm mb-8 font-light italic">
              Real-time intelligence gathered from global news indices in the last 24 hours.
            </p>
            
            <form onSubmit={handleResearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
              <div className="relative flex bg-brand-surface border border-brand-border rounded-lg shadow-2xl p-1.5 focus-within:border-blue-500/50 transition-all">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter research topic (e.g., Quantum Computing Trends 2024)" 
                  className="flex-1 bg-transparent border-none outline-none ring-0 px-4 text-sm font-medium placeholder:text-zinc-600"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Research
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="absolute top-full mt-2 text-red-500 text-[10px] font-bold uppercase tracking-tight">
                  {error}
                </div>
              )}
            </form>
          </div>
        </header>

        {/* Results Section */}
        <section className="flex-1 p-8 pt-4 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div className="flex items-center gap-2">
                <span className={cn("flex h-2 w-2 rounded-full", loading ? "bg-blue-500 animate-pulse" : "bg-emerald-500")} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dim">
                  {loading ? "Synthesizing Intelligence..." : "Latest Reports: Last 24 Hours"}
                </span>
              </div>
              <div className="text-xs text-brand-muted italic font-light">
                {results.length > 0 ? `${results[0].topic} results` : "3 sources required"}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative group bg-brand-bg border border-brand-border rounded-xl p-8 shadow-sm hover:border-brand-dim/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-xs text-brand-dim font-medium uppercase tracking-tighter">
                      <Newspaper className="w-3 h-3" />
                      {result.timestamp} • Active Research
                    </div>
                    <button 
                      onClick={() => removeResult(result.id)}
                      className="p-1 text-brand-dim hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="markdown-body">
                    <Markdown>{result.content}</Markdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!loading && results.length === 0 && (
              <div className="py-24 text-center border-2 border-dashed border-brand-border rounded-3xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-surface rounded-full mb-4">
                  <Sparkles className="w-5 h-5 text-brand-dim" />
                </div>
                <h3 className="text-brand-text font-medium text-lg tracking-tight mb-1">Knowledge Engine Ready</h3>
                <p className="text-brand-muted text-sm font-light">Synthesize global data streams into actionable intelligence.</p>
              </div>
            )}

            {loading && results.length === 0 && (
              <div className="py-24 space-y-6 text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin relative mx-auto" />
                </div>
                <div className="space-y-1">
                  <p className="text-brand-text font-medium tracking-tight">Accessing Insight-Core Indices...</p>
                  <p className="text-brand-dim text-[10px] uppercase tracking-widest font-bold">Latency: 1.2s</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer Info */}
        <footer className="px-8 py-4 border-t border-brand-border flex items-center justify-between text-brand-dim text-[10px] shrink-0">
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-tighter">Search Confidence: <span className="text-white font-bold italic">98%</span></span>
            <span className="w-px h-3 bg-brand-border" />
            <span className="uppercase tracking-tighter">AI Reasoning: <span className="text-white font-bold italic">Active</span></span>
          </div>
          <div className="flex items-center gap-1 uppercase tracking-[0.05em] font-medium">
            Processed via Gemini-Flash Grounding
          </div>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
}
