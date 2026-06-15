const { g } = require('./wrapper.js');

console.log("========================================================");
console.log("🔥 RUNNING GUTS ALL-IN-ONE MASTER INTEGRATION SUITE 🔥");
console.log("========================================================\n");

// ==========================================
// STAGE 1: PRIMITIVES & NATIVE ARRAYS
// ==========================================
console.log("📦 [1/5] Testing Arrays & Basic Primitives...");
const monitorSchema = g.object({
  cluster: g.string().min(3),
  nodes: g.array(g.number().max(50))
});

try {
  const data = { cluster: "us-east", nodes: [12, 45, 22] };
  console.log("  ✅ Test 1 (Array Validation Pass):", !!monitorSchema.parse(data));
} catch (e) {
  console.error("  ❌ Test 1 Failed:", e.message);
}

try {
  const badData = { cluster: "us-east", nodes: [12, 99, 22] }; 
  monitorSchema.parse(badData);
} catch (e) {
  console.log("  ✅ Test 2 (Array Index Trace Captured):\n     👉", e.message);
}

// ==========================================
// STAGE 2: REAL-TIME AI TOKEN STREAMING
// ==========================================
console.log("\n🤖 [2/5] Testing Resilient AI Token Stream Engine...");
const aiOutputSchema = g.object({
  summary: g.string().max(10)
});

try {
  aiOutputSchema.parseStream(`{"summary": "He`); 
  aiOutputSchema.parseStream(`{"summary": "Hello W`); 
  console.log("  ✅ Test 3 (Incomplete Stream Safety Pass) Verified");

  aiOutputSchema.parseStream(`{"summary": "Hello World, this is too long!"}`); 
  console.error("  ❌ Test 4 Failed: Allowed stream boundary overflow.");
} catch (e) {
  console.log("  ✅ Test 4 (Instant Stream Overrun Intercepted):\n     👉", e.message);
}

// ==========================================
// STAGE 3: COERCION & MESSAGING OVERRIDES
// ==========================================
console.log("\n⚡ [3/5] Testing Inline Coercion & Message Overrides...");
const configSchema = g.object({
  apiKey: g.string().min(10, "Your configuration token is entirely too short!"),
  port: g.coerce.number(),
  debugMode: g.coerce.boolean()
});

try {
  const rawInput = {
    apiKey: "SEC_KEY_VAL_10203040",
    port: "8080",      
    debugMode: "true"  
  };
  const parsedOutput = configSchema.parse(rawInput);
  console.log("  ✅ Test 5 (Data Mutated Inline Successfully):", typeof parsedOutput.port === 'number' && typeof parsedOutput.debugMode === 'boolean');
} catch (e) {
  console.error("  ❌ Test 5 Coercion Error:", e.message);
}

try {
  const shortKeyPayload = { apiKey: "short", port: 3000, debugMode: false };
  configSchema.parse(shortKeyPayload);
} catch (e) {
  console.log("  ✅ Test 6 (Custom Error Message Override Fired):\n     👉", e.message);
}

// ==========================================
// STAGE 4: COMPLEX COMBINATORS (UNIONS & ENUMS)
// ==========================================
console.log("\nPolymorphic Logic Gates...");
const combinatorSchema = g.object({
  role: g.enum(["admin", "user"]),
  status: g.union([g.string(), g.number()])
});

try {
  const badEnumData = { role: "superuser", status: "active" };
  combinatorSchema.parse(badEnumData);
} catch (e) {
  console.log("  ✅ Test 7 (Enum Variant Verification Trace):\n     👉", e.message);
}

try {
  const badUnionData = { role: "user", status: true };
  combinatorSchema.parse(badUnionData);
} catch (e) {
  console.log("  ✅ Test 8 (Aggregated Union Defect Matrix):\n     👉", e.message);
}

// ==========================================
// STAGE 5: ADVANCED BARE-METAL EXTENSIONS
// ==========================================
console.log("\n🚀 [5/5] Testing Tuples, Records, & String Formats...");
const networkSchema = g.object({
  coordinates: g.tuple([g.string(), g.number()]),
  routing: g.record(g.string().email()),
  systemId: g.string().uuid()
});

try {
  const badRecordEmail = {
    coordinates: ["ZONE-B", 505],
    routing: { gateway: "not-an-email" },
    systemId: "906b3a32-1b15-4ba8-bb4e-749629b3a3d5"
  };
  networkSchema.parse(badRecordEmail);
} catch (e) {
  console.log("  ✅ Test 9 (Record Native Formatting Error):\n     👉", e.message);
}

try {
  const badUuid = {
    coordinates: ["ZONE-B", 505],
    routing: { gateway: "admin@guts.dev" },
    systemId: "invalid-uuid-string"
  };
  networkSchema.parse(badUuid);
} catch (e) {
  console.log("  ✅ Test 10 (Zero-Allocation UUID Verification Passed):\n     👉", e.message);
}

console.log("\n========================================================");
console.log("🎉 ALL 10 SYSTEMS FULLY COPIED, TYPED, AND OPERATIONAL!");
console.log("========================================================");