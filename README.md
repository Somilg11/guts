# ⚡ guts

`guts` is a hyper-performance, memory-compiled structural schema validation library for Node.js, engineered entirely in native Rust.

By bypassing traditional runtime parsing loops and utilizing a single-compilation blueprint architecture, `guts` delivers zero-overhead type checking, inline data coercion, custom error messaging, and non-blocking, token-by-token stream validation for AI/LLM outputs at execution speeds that heavily outperform pure JavaScript alternatives like Zod.

---

## 🚀 The Core Philosophy

Most JavaScript validation libraries force you to make a choice:

- Incredible developer experience with massive runtime performance penalties (**Zod**)
- Blazing-fast execution with dense, unergonomic, and clunky schemas (**Ajv**)

`guts` completely eliminates this trade-off by combining a **fluent, chainable JavaScript API** with an **AOT-style compiled native Rust validation engine**.

### Unfair Technical Advantages

- **One-Time Blueprint Compilation:** Your schema shapes are translated into optimized Rust enum variants *exactly once* during instantiation, freeing your hot application pathways from redundant JSON parsing overhead.
- **Resilient Boundary Synthesis (AI Streaming):** Validates raw, incomplete text chunks directly from streaming LLM endpoints. It dynamically repairs missing closing syntax characters on the fly, verifying structural rules mid-stream without crashing.
- **Inline Type Mutation (Coercion):** Mutates data structures directly within highly optimized native loops, converting dirty input primitives (like stringified numbers or booleans) into precise types before returning them to the V8 thread.
- **Zero-Copy Memory Passing:** Leverages high-speed serialization abstractions via NAPI-RS to safely share data between the V8 JavaScript runtime and native machine threads.
- **Deterministic Trace Arrays:** Features a lightweight recursive vector engine that maps precise nested property error sequences (`Error at [routing.table.0.gateway]`) with zero extra heap allocation penalties.

---

## 🛠 Under the Hood Architecture

Traditional runtime validators recursively walk through high-level JavaScript function trees on every incoming payload. This triggers routine JIT compiler optimization bailouts in V8 and stresses the garbage collector with short-lived metadata allocations.

`guts` operates through a clear low-latency execution pipeline:

```text
┌────────────────────────────────────────┐
│     Fluent JavaScript Schema API       │  <- Autocomplete & Validation Setup
│   (g.object, g.union, g.string, etc)   │
└───────────────────┬────────────────────┘
                    │
                    │ 1. One-time JSON Blueprint Stringification
                    ▼
┌────────────────────────────────────────┐
│           NAPI-RS FFI Bridge           │  <- High-speed memory boundary handover
└───────────────────┬────────────────────┘
                    │
                    │ 2. V8 Primitive Translation into Native Types
                    ▼
┌────────────────────────────────────────┐
│     Memory-Persistent Rust Engine      │  <- Deep pattern-matched CPU instructions
└────────────────────────────────────────┘
```

### The Zero-Allocation String Filter Strategy

Unlike alternative setups that drop performance by jumping across the FFI to evaluate regular expressions in JavaScript, `guts` processes validation criteria like `.email()` and `.uuid()` strictly inside Rust.

It scans the memory block using zero-allocation byte parsing loops that evaluate formatting structures directly inside low-level CPU registers.

---

## 📦 Project Directory Layout

```text
guts/
├── .cargo/
│   └── config.toml      # Platform-specific native linker optimizations
├── src/
│   └── lib.rs           # Core structural pattern-matching Rust engine
├── .vscode/
│   └── settings.json    # Language-server diagnostics tuning
├── Cargo.toml           # Native package dependency declarations
├── package.json         # Scripts, workspace parameters, and NAPI metadata
├── wrapper.js           # Fluent API wrapper layer
├── index.d.ts           # Compile-time static type inference layer
└── test.js              # 10-Gate complete system evaluation suite
```

---

## 🔧 Installation & Local Compilations

### Prerequisites

Ensure you have the native systems dependencies configured on your local machine:

- Node.js (v18 or higher recommended)
- Rust Toolchain

Install Rust via:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Step-by-Step Build Flow

```bash
# 1. Clone or navigate into your project workspace
cd guts

# 2. Install developer toolchain configurations
npm install

# 3. Compile the native Rust library into machine code (.node binary)
npm run build:debug

# 4. Fire up the end-to-end integration verification suite
npm test
```

---

## 🛡️ Compile-Time Static Type Safety

`guts` ships with a highly advanced type extraction engine matching Zod's compiler profile perfectly.

You define your schema structural layout exactly once, and your editor extracts the exact type system contract automatically with zero code duplication.

```typescript
import { g, Infer } from './guts';

const signupSchema = g.object({
  email: g.string().email(),
  age: g.coerce.number(),
  preferences: g.tuple([g.string(), g.boolean()]),
  sponsorCode: g.string().optional()
});

// Extract the safe type footprint
type SignupRequest = Infer<typeof signupSchema>;

/*
  The compiler automatically evaluates 'SignupRequest' as:
  {
    email: string;
    age: number;
    preferences: [string, boolean];
    sponsorCode: string | undefined;
  }
*/
```

---

## 💡 Usage Guide & API Reference

### Import the Schema Builder

```javascript
const { g } = require('./wrapper.js');
```

---

### 1. Primitives & Zero-Allocation Formats

```javascript
// Strings with length constraints and formatting filters
const userSchema = g.string().min(3).max(15);
const emailSchema = g.string().email();
const idSchema = g.string().uuid();

// Numbers and range checking
const ageSchema = g.number().min(18).max(99);

// Booleans
const flagSchema = g.boolean();
```

---

### 2. Inline Data Coercion

The `g.coerce` namespace handles automatic type transformations.

If a client sends string values over raw network bodies, `guts` casts them inline during compilation matching your primitives cleanly.

```javascript
const hardwareConfig = g.object({
  port: g.coerce.number(),      // Converts "8080" -> 8080
  debugMode: g.coerce.boolean() // Converts "true" -> true
});

const cleanedData = hardwareConfig.parse({
  port: "8080",
  debugMode: "true"
});
```

---

### 3. Advanced Structural Schemas

```javascript
// Native Arrays with item type rules
const tagsSchema = g.array(g.string().min(2));

// Fixed-Length Tuples (Strict position and size matching)
const coordinateSchema = g.tuple([
  g.string(),
  g.number()
]);

// Expects precisely [string, number]

// Records (Dynamic map keys with uniform validation values)
const userRegistry = g.record(g.string().email());

// Key dictionary where every value MUST pass an email check
```

---

### 4. Combinators & Custom Messaging

```javascript
// Enums (String target matrices validation)
const roleSchema = g.enum(
  ["admin", "user"],
  { message: "Unauthorized group role selection!" }
);

// Literals & Union logic gates
const statusSchema = g.union([
  g.string(),
  g.number()
]);

// Injection of user-defined error messages directly into rules
const tokenSchema = g.string().min(
  32,
  "Critical error: API access token is truncated!"
);
```

---

## 🤖 Real-Time Token Stream Validation (AI Engine)

When building AI agents or processing structured LLM generation loops, waiting for the full response to finish before running validation wastes time and compromises safety.

`guts` processes incomplete tokens on the fly.

```javascript
const aiOutputSchema = g.object({
  summary: g.string().max(10)
});

// Simulated incremental token chunks arriving from an AI model stream loop:
aiOutputSchema.parseStream(`{"summary": "He`);
// Passes (Repaired to {"summary": "He"} and checked)

aiOutputSchema.parseStream(`{"summary": "Hello`);
// Passes (Repaired to {"summary": "Hello"} and checked)

try {
  // This specific token push breaks the max length constraint of 10 characters
  aiOutputSchema.parseStream(
    `{"summary": "Hello World, this is too long!"}`
  );
} catch (error) {
  console.log(error.message);
  // "Error at [summary]: String too long (Max: 10)"
}
```

---

## 🛑 Interpreting Trace Error Responses

### Missing Key Faults

```javascript
// Throws:
"Error at [role]: Missing required field"
```

### Deep Tuple Length Violations

```javascript
// Given coordinates: ["ZONE-A", 404, "STRAY_DATA"]

// Throws:
"Error at [coordinates]: Tuple length mismatch. Expected 2, got 3"
```

### Deep Record Format Defect

```javascript
// Given routing: { gateway: "not-an-email" }

// Throws:
"Error at [routing.gateway]: Invalid email format syntax"
```

### Custom Overrides Capture

```javascript
// Given apiKey: "short"

// Throws:
"Error at [apiKey]: Your configuration token is entirely too short!"
```

---

## 🚢 Production Deployment

To package and bundle `guts` for production multi-platform architectures, switch from your local debug engine configurations to optimized release bundles:

```bash
npm run build
```

This production build script utilizes the `@napi-rs/cli` to trigger compiler target flags, generating an optimized `guts.node` machine artifact alongside automated loading modules (`guts.js`) and complete autocomplete type declaration layers (`index.d.ts`).

---

## 🎯 Feature Comparison Matrix

| Feature | guts | Zod | Ajv |
|----------|------|------|------|
| Fluent Developer API | ✅ | ✅ | ❌ |
| Native Rust Engine | ✅ | ❌ | ❌ |
| One-Time Schema Compilation | ✅ | ❌ | ⚠️ Partial |
| Nested Trace Errors | ✅ | ✅ | ⚠️ Verbose |
| Partial Stream Parsing (AI) | ✅ | ❌ | ❌ |
| Inline Data Coercion | ✅ | ✅ | ❌ |
| Zero-Copy Native Validation | ✅ | ❌ | ❌ |
| Runtime Execution Profile | 🚀 Hyper-Fast | 🐢 Slow | ⚡ Fast |

---

## ⚡ Closing Statement

> **guts — Ergonomics of Zod. Performance of Systems Programming.**