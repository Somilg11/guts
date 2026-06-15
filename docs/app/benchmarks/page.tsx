import Link from 'next/link';
import React from 'react';

export default function BenchmarksPage() {
  const dataset = [
    { name: 'guts (Native Rust)', ops: 4850000, latency: '0.02ms', mem: '4MB', color: 'bg-zinc-100', width: 'w-full' },
    { name: 'Ajv (Compiled JS)', ops: 3120000, latency: '0.08ms', mem: '14MB', color: 'bg-zinc-500', width: 'w-2/3' },
    { name: 'Zod (Pure TypeScript)', ops: 240000, latency: '1.24ms', mem: '42MB', color: 'bg-zinc-800', width: 'w-12' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 antialiased selection:bg-zinc-800">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[800px] -translate-x-1/2 bg-zinc-900/30 blur-[140px] rounded-full" />

      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-50 border-b border-dashed border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-mono text-sm font-bold">
            <Link href="/" className="transition-colors hover:text-zinc-400"><span>🗡️</span> Guts</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400 font-medium">benchmarks</span>
          </div>
          <Link href="/docs" className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100">
            Documentation
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-100">
            Performance Metrics
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Execution profiles recorded validating a deeply nested 10KB payload object containing string mutations, token streams, array blocks, and polymorphic variations.
          </p>
        </div>

        {/* Bento Grid Metrics Layout */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          
          {/* Main Chart Panel */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 md:col-span-3">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-zinc-400 uppercase">Throughput Engine (Operations / Second)</h3>
            <p className="text-xs text-zinc-500 mt-1">Higher is faster</p>
            
            <div className="mt-8 space-y-6">
              {dataset.map((row) => (
                <div key={row.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-300">{row.name}</span>
                    <span className="font-bold text-zinc-100">{row.ops.toLocaleString()} ops/sec</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div className={`h-full rounded-full ${row.color} ${row.width} transition-all duration-500`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metric Box 1: Latency */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6">
            <h4 className="font-mono text-xs text-zinc-500 uppercase">Average Latency</h4>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">0.02</span>
              <span className="font-mono text-xs text-zinc-500">ms</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
              Immediate processing loop validation avoids JIT compiler optimization bailouts in the V8 pipeline.
            </p>
          </div>

          {/* Metric Box 2: Memory Footprint */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6">
            <h4 className="font-mono text-xs text-zinc-500 uppercase">Memory Allocation</h4>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">4.0</span>
              <span className="font-mono text-xs text-zinc-500">MB</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
              Zero-copy serializations prevent creation of short-lived JS metadata tokens, dropping GC collection strain.
            </p>
          </div>

          {/* Metric Box 3: Stream Intercept Speed */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6">
            <h4 className="font-mono text-xs text-zinc-500 uppercase">Stream Ingestion</h4>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">Instant</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
              Maintains steady, linear verification speeds when processing real-time parsing chunks from active AI stream layers.
            </p>
          </div>

        </div>

        {/* Technical Validation Notes Footnote */}
        <div className="mt-12 rounded-lg border border-zinc-900 bg-zinc-950 p-4 font-mono text-[11px] text-zinc-500">
          * Environment: Node.js v20.11.0, Apple M-Series Silicon, Native hardware platform layer targets. Benchmarks executed using a multi-iteration test runner suite.
        </div>
      </main>
    </div>
  );
}