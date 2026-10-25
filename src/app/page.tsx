import { Terminal, Code2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">KeepCoding</span>
              <span className="ml-2 text-xs text-zinc-500 font-mono">v0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure Judge
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col items-center">
        <div className="w-full max-w-3xl text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <Zap className="w-3 h-3 text-amber-400" />
            Daily hands-on practice for developers
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            Keep your coding intuition sharp.
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Active practice only. Read, think, and write code by hand in an isolated workspace.
            Evaluated by a private dry-run judge with actionable feedback.
          </p>
        </div>

        {/* Setup Status / Next Steps Card */}
        <div className="w-full max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-medium text-zinc-200">System Ready &bull; Task 1 Complete</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-850 space-y-1">
              <p className="font-medium text-zinc-300">Next.js &amp; App Router</p>
              <p className="text-zinc-500">Configured with TypeScript &amp; Tailwind CSS</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-850 space-y-1">
              <p className="font-medium text-zinc-300">Zero Secret Leakage</p>
              <p className="text-zinc-500">Protected .env files and verified .gitignore</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-850 space-y-1">
              <p className="font-medium text-zinc-300">Tagged Challenge Parser</p>
              <p className="text-zinc-500">Scheduled for Task 2</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-850 space-y-1">
              <p className="font-medium text-zinc-300">3-Column Workspace</p>
              <p className="text-zinc-500">Scheduled for Task 4</p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        KeepCoding &bull; Active coding practice
      </footer>
    </div>
  );
}
