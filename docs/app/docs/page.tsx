'use client';

import Link from 'next/link';
import React, { useState } from 'react';

// --- Reusable Code Block with Interactive Copy Trigger ---
interface CodeBlockProps {
  code: string;
}

function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="font-mono text-xs text-zinc-300 overflow-x-auto bg-zinc-950 p-4 rounded-lg border border-zinc-800 leading-relaxed">
        {code.trim()}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 text-[10px] font-mono text-zinc-500 hover:text-zinc-200 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 transition-all opacity-0 group-hover:opacity-100 select-none z-10"
      >
        {copied ? 'COPIED!' : 'COPY'}
      </button>
    </div>
  );
}

// --- Navigation Configuration ---
interface DocSection {
  id: string;
  title: string;
  category: string;
}

const SECTIONS: DocSection[] = [
  { id: 'getting-started', title: 'Getting Started', category: 'Overview' },
  { id: 'primitives', title: 'Primitives', category: 'Core API' },
  { id: 'string-formats', title: 'String Formats', category: 'Core API' },
  { id: 'coercion', title: 'Data Coercion', category: 'Core API' },
  { id: 'complex-structures', title: 'Complex Structures', category: 'Advanced' },
  { id: 'combinators', title: 'Combinators & Unions', category: 'Advanced' },
  { id: 'ai-streaming', title: 'AI Stream Parsing', category: 'Features' },
  { id: 'type-inference', title: 'Type Inference', category: 'TypeScript' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categories = SECTIONS.reduce((acc, current) => {
    if (!acc[current.category]) acc[current.category] = [];
    acc[current.category].push(current);
    return acc;
  }, {} as Record<string, DocSection[]>);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 antialiased selection:bg-zinc-800">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-dashed border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-mono text-sm font-bold">
            <Link href="/" className="hover:text-zinc-300 transition-colors"><span>🗡️</span> Guts</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400 font-medium text-xs">docs</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/benchmarks" className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100">Benchmarks</a>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] uppercase text-zinc-400 sm:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 transform border-r border-dashed border-zinc-800 bg-zinc-950 p-6 transition-transform duration-200 ease-in-out pt-20
            sm:sticky sm:top-14 sm:h-[calc(100vh-3.5rem)] sm:w-48 sm:translate-x-0 sm:border-r-0 sm:p-0 sm:pt-8
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          `}>
            <div className="space-y-6">
              {Object.entries(categories).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    {category}
                  </h4>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollTo(item.id)}
                          className={`w-full text-left text-xs font-medium py-1 transition-colors ${
                            activeSection === item.id 
                              ? 'text-zinc-100 font-semibold border-l border-zinc-400 pl-2 -ml-2' 
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile Menu Backdrop */}
          {mobileMenuOpen && (
            <div 
              onClick={() => setMobileMenuOpen(false)} 
              className="fixed inset-0 z-30 bg-zinc-950/60 backdrop-blur-sm sm:hidden" 
            />
          )}

          {/* Main Content Feed */}
          <main className="flex-1 py-8 sm:py-12 max-w-3xl space-y-16">
            
            {/* Section: Getting Started */}
            <section id="getting-started" className="scroll-mt-20 space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100">Getting Started</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                guts introduces a compiled abstract syntax architecture to data schema evaluation. By evaluating blueprints directly inside hardware-level machine layers via an optimized Rust framework, runtime overhead drops to absolute functional minimums.
              </p>
              <CodeBlock code={`// Core initiation contract\nconst { g } = require('guts');`} />
            </section>

            {/* Section: Primitives */}
            <section id="primitives" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Primitive Node Mapping</h2>
                <p className="text-xs text-zinc-400 mt-1">Core native datatypes and scalar constraint chaining structures.</p>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Primitive boundaries evaluate string size limits, numerical intervals, and clean boolean truth passes natively on the stack space before heap assignments happen.
                </p>
                <CodeBlock code={`const userSchema = g.object({\n  username: g.string().min(3).max(20),\n  score: g.number().min(0).max(100),\n  isActive: g.boolean()\n});`} />
              </div>
            </section>

            {/* Section: String Formats */}
            <section id="string-formats" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">High-Performance String Formats</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Avoid context-switching overhead back to slow JavaScript execution arrays. Formats like `.email()` and `.uuid()` are evaluated entirely in Rust using zero-allocation byte validation sequences.
              </p>
              <CodeBlock code={`const secureIdentity = g.object({\n  id: g.string().uuid(),\n  contactEmail: g.string().email()\n});`} />
            </section>

            {/* Section: Coercion */}
            <section id="coercion" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">Inline Data Coercion</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The `g.coerce` layer alters raw or stringified incoming parameters inside native memory spaces directly, ensuring clean typing before handing data packets back to the main V8 thread.
              </p>
              <CodeBlock code={`const gatewayPayload = g.object({\n  port: g.coerce.number(),    // Converts "8080" to 8080 inline\n  secure: g.coerce.boolean()  // Converts "true" to true\n});`} />
            </section>

            {/* Section: Complex Structures */}
            <section id="complex-structures" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Advanced Complex Structures</h2>
                <p className="text-xs text-zinc-400 mt-1">Fixed tuples, native arrays, and uniform record map configurations.</p>
              </div>
              <CodeBlock code={`const extendedMap = g.object({\n  tags: g.array(g.string()),\n  coordinates: g.tuple([g.string(), g.number()]), // Exact matching length and type\n  registry: g.record(g.string().email())          // Dynamic keys mapping to emails\n});`} />
            </section>

            {/* Section: Combinators */}
            <section id="combinators" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">Polymorphic Logic & Decorators</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Compose flexible architectures using options, literal declarations, and short-circuiting union logic pipelines.
              </p>
              <CodeBlock code={`const flexibleProfile = g.object({\n  nickname: g.string().optional(),\n  role: g.enum(["admin", "user"]),\n  status: g.union([g.string(), g.number()])\n});`} />
            </section>

            {/* Section: AI Streaming */}
            <section id="ai-streaming" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">Resilient Boundary AI Stream Repair</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                `parseStream()` tracks structural states of open arrays or objects on the fly, auto-synthesizing required trailing tags to safely assert limits mid-stream.
              </p>
              <CodeBlock code={`// Process raw string segments from live AI outputs directly\naiSchema.parseStream('{"summary": "Generative'); // Asserts valid pass`} />
            </section>

            {/* Section: Type Inference */}
            <section id="type-inference" className="scroll-mt-20 border-t border-dashed border-zinc-900 pt-12 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">TypeScript Type Inference</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Derive precise typescript interfaces compilation contracts from structural definition models directly without duplicating type schemas manually.
              </p>
              <CodeBlock code={`import { g, Infer } from 'guts';\n\nconst appSchema = g.object({ token: g.string().uuid() });\ntype AppConfig = Infer<typeof appSchema>;`} />
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}