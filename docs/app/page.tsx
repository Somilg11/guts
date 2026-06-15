'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('npm');
  const [copied, setCopied] = useState(false);

  const installCommands: Record<string, string> = {
    npm: 'npm i guts',
    pnpm: 'pnpm add guts',
    yarn: 'yarn add guts',
    bun: 'bun add guts',
    cargo: 'cargo add guts',
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 antialiased selection:bg-zinc-800">
      {/* Glow Effect Accents */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 bg-zinc-900/40 blur-[120px] rounded-full" />

      {/* Navigation Menu Header */}
      <header className="sticky top-0 z-50 border-b border-dashed border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight">
            <Link href="/" className="hover:text-zinc-300 transition-colors"><span>🗡️</span> Guts</Link>
          </div>
          <nav className="flex items-center gap-6 text-xs font-medium text-zinc-400">
            <Link href="/docs" className="transition-colors hover:text-zinc-100">Documentation</Link>
            <Link href="/benchmarks" className="transition-colors hover:text-zinc-100">Benchmarks</Link>
            <Link href="https://github.com/Somilg11" target="_blank" rel="noreferrer" className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-200 transition-colors hover:bg-zinc-800">GitHub</Link>
          </nav>
        </div>
      </header>

      {/* Hero Header Presentation */}
      <main className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-zinc-800 bg-zinc-900/50 px-3 py-1 font-mono text-[11px] tracking-wider text-zinc-400 uppercase">
            Version 1.0.0 Live on NPM
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-zinc-100">
            Ergonomics of <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-500">Zod</span>.<br />
            Performance of <span className="underline decoration-zinc-700 decoration-wavy underline-offset-8">Rust</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-400">
            A hyper-performance, memory-compiled structural schema validation library engineered entirely in native assembly instructions. Zero JIT bailouts. Non-blocking AI token streaming.
          </p>
          
          {/* Installation Switcher */}
          <div className="mx-auto mt-10 max-w-sm">
            <div className="flex items-center justify-center gap-1 mb-3">
              {Object.keys(installCommands).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full transition-colors ${
                    activeTab === tab 
                    ? 'bg-zinc-100 text-zinc-950 font-bold' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative group">
              <code className="block rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-4 font-mono text-sm text-zinc-300 text-left">
                <span className="text-zinc-500 select-none">$</span> {installCommands[activeTab]}
              </code>
              <button 
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 hover:text-zinc-200 bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800 transition-all opacity-0 group-hover:opacity-100"
              >
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>
        </div>

        {/* Bento Configuration Grid Panels */}
        <section className="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: One-Time Blueprint Compiler */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm sm:col-span-2">
            <div className="font-mono text-xs font-semibold text-zinc-400">01 / RECURSIVE COMPILED Blueprints</div>
            <h3 className="mt-3 text-lg font-bold text-zinc-200">AOT Blueprint Matrix</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Shapes compile into static native enum variants exactly once. Your production execution channels execute structural safety validation matches using hardware-level memory boundaries instead of running iterative JavaScript functional lookup trees.
            </p>
          </div>

          {/* Card 2: Microscopic Footprint Performance profiling */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
            <div className="font-mono text-xs font-semibold text-zinc-400">02 / RUNTIME ENGINE</div>
            <h3 className="mt-3 text-lg font-bold text-zinc-200">Zero-Copy Memory</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              NAPI FFI allocations transfer primitive state vectors into native threads directly without stressing the V8 garbage collector with short-lived structure references.
            </p>
          </div>

          {/* Card 3: AI Stream Healing Mechanics */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm">
            <div className="font-mono text-xs font-semibold text-zinc-400">03 / STREAM HANDLING</div>
            <h3 className="mt-3 text-lg font-bold text-zinc-200">AI Streaming Guard</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Evaluates broken, raw token text streams dynamically. Synthesizes missing JSON brackets mid-stream on-the-fly to execute real-time boundary verification checks before completion.
            </p>
          </div>

          {/* Card 4: Inline Type Coercion Architecture */}
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm sm:col-span-2">
            <div className="font-mono text-xs font-semibold text-zinc-400">04 / MUTABLE TYPE TRANSFORMS</div>
            <h3 className="mt-3 text-lg font-bold text-zinc-200">Inline Coercion Layer</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Transforms mismatched network primitives directly within highly optimized native Rust loops. Safely mutates and normalizes type footprints inside systems memory spaces before returning them cleanly across the bridge.
            </p>
          </div>
        </section>

        {/* Documentation / Code Implementation Samples Panel */}
        <section id="docs" className="mt-24 border-t border-dashed border-zinc-800 pt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-200">Fluent API Footprint</h2>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Designed to maintain complete syntax parity with standard validation workflows. Supports enums, tuples, records, nested object boundaries, custom messaging filters, and static compile-time type inference declarations.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs leading-relaxed text-zinc-300 md:col-span-3">
              <span className="text-zinc-500 select-none">&nbsp;&nbsp; Initialize strict structural rulesets</span><br />
              <span className="text-zinc-400">const</span> <span className="text-zinc-200">clusterSchema</span> = <span className="text-zinc-400">g</span>.<span className="text-zinc-300">object</span>({`{`}<br />
              &nbsp;&nbsp;<span className="text-zinc-300">id:</span> <span className="text-zinc-400">g</span>.<span className="text-zinc-300">string().uuid(),</span><br />
              &nbsp;&nbsp;<span className="text-zinc-300">routing:</span> <span className="text-zinc-400">g</span>.<span className="text-zinc-300">record(g.string().email()),</span><br />
              &nbsp;&nbsp;<span className="text-zinc-300">metrics:</span> <span className="text-zinc-400">g</span>.<span className="text-zinc-300">tuple([g.string(), g.coerce.number()])</span><br />
              {`});`}<br /><br />
              <span className="text-zinc-500 select-none">&nbsp;&nbsp; Derive native TypeScript interfaces directly</span><br />
              <span className="text-zinc-400">type</span> <span className="text-zinc-200">Cluster</span> = <span className="text-zinc-400">Infer</span>&lt;<span className="text-zinc-400">typeof</span> <span className="text-zinc-300">clusterSchema</span>&gt;;
            </div>
          </div>
        </section>
      </main>
      
      <footer className="mt-32 border-t border-dashed border-zinc-800 py-12 text-center">
        <p className="text-[10px] font-mono text-zinc-600 tracking-[0.2em] uppercase">
          Engineered for System Critical Performance &copy; 2026
        </p>
      </footer>
    </div>
  );
}