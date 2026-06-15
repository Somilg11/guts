const path = require('path');
let native;

try {
  if (process.platform === 'darwin' && process.arch === 'arm64') {
    native = require('./guts.darwin-arm64.node');
  } else if (process.platform === 'darwin' && process.arch === 'x64') {
    native = require('./guts.darwin-x64.node');
  } else if (process.platform === 'linux' && process.arch === 'x64') {
    native = require('./guts.linux-x64-gnu.node');
  } else if (process.platform === 'win32' && process.arch === 'x64') {
    native = require('./guts.win32-x64-msvc.node');
  } else {
    // Fallback to local default build
    native = require('./guts.node');
  }
} catch (e) {
  try {
    native = require('./guts.node');
  } catch (err) {
    throw new Error(`Failed to load native guts binary for ${process.platform}-${process.arch}: ${err.message}`);
  }
}

class BaseSchema {
  constructor() { this._compiledInstance = null; }
  optional() { return new OptionalSchema(this); }
  nullable() { return new NullableSchema(this); }
  _compile() {
    if (!this._compiledInstance) {
      this._compiledInstance = new native.GutsValidator(JSON.stringify(this.toJSON()));
    }
    return this._compiledInstance;
  }
  parse(input) { return this._compile().parse(input); }
  parseStream(chunk) { return this._compile().parseStream(chunk); }
}

class StringSchema extends BaseSchema {
  constructor(opts = {}) { super(); this._min = null; this._max = null; this._msg = opts.message || null; this._coerce = opts.coerce || false; this._format = null; }
  min(val, msg) { this._min = val; if(msg) this._msg = msg; return this; }
  max(val, msg) { this._max = val; if(msg) this._msg = msg; return this; }
  email() { this._format = 'email'; return this; }
  uuid() { this._format = 'uuid'; return this; }
  toJSON() { return { type: 'string', min: this._min, max: this._max, message: this._msg, coerce: this._coerce, format: this._format }; }
}

class NumberSchema extends BaseSchema {
  constructor(opts = {}) { super(); this._min = null; this._max = null; this._msg = opts.message || null; this._coerce = opts.coerce || false; }
  min(val, msg) { this._min = val; if(msg) this._msg = msg; return this; }
  max(val, msg) { this._max = val; if(msg) this._msg = msg; return this; }
  toJSON() { return { type: 'number', min: this._min, max: this._max, message: this._msg, coerce: this._coerce }; }
}

class BooleanSchema extends BaseSchema { 
  constructor(opts = {}) { super(); this._msg = opts.message || null; this._coerce = opts.coerce || false; }
  toJSON() { return { type: 'boolean', message: this._msg, coerce: this._coerce }; } 
}

class ArraySchema extends BaseSchema {
  constructor(items) { super(); this.items = items; }
  toJSON() { return { type: 'array', items: this.items.toJSON() }; }
}

class TupleSchema extends BaseSchema {
  constructor(items) { super(); this.items = items; }
  toJSON() { return { type: 'tuple', items: this.items.map(i => i.toJSON()) }; }
}

class RecordSchema extends BaseSchema {
  constructor(values) { super(); this.values = values; }
  toJSON() { return { type: 'record', values: this.values.toJSON() }; }
}

class ObjectSchema extends BaseSchema {
  constructor(shape) { super(); this.shape = shape; }
  toJSON() {
    const shapeConfig = {};
    for (const [key, schema] of Object.entries(this.shape)) {
      shapeConfig[key] = schema.toJSON();
    }
    return { type: 'object', shape: shapeConfig };
  }
}

class EnumSchema extends BaseSchema {
  constructor(values, opts = {}) { super(); this.values = values; this._msg = opts.message || null; }
  toJSON() { return { type: 'enum', values: this.values, message: this._msg }; }
}

class LiteralSchema extends BaseSchema {
  constructor(value, opts = {}) { super(); this.value = value; this._msg = opts.message || null; }
  toJSON() { return { type: 'literal', value: this.value, message: this._msg }; }
}

class OptionalSchema extends BaseSchema {
  constructor(inner) { super(); this.inner = inner; }
  toJSON() { return { type: 'optional', inner: this.inner.toJSON() }; }
}

class NullableSchema extends BaseSchema {
  constructor(inner) { super(); this.inner = inner; }
  toJSON() { return { type: 'nullable', inner: this.inner.toJSON() }; }
}

class UnionSchema extends BaseSchema {
  constructor(options) { super(); this.options = options; }
  toJSON() { return { type: 'union', options: this.options.map(o => o.toJSON()) }; }
}

const g = {
  string: (opts) => new StringSchema(opts),
  number: (opts) => new NumberSchema(opts),
  boolean: (opts) => new BooleanSchema(opts),
  array: (items) => new ArraySchema(items),
  tuple: (items) => new TupleSchema(items),
  record: (values) => new RecordSchema(values),
  object: (shape) => new ObjectSchema(shape),
  enum: (values, opts) => new EnumSchema(values, opts),
  literal: (value, opts) => new LiteralSchema(value, opts),
  union: (options) => new UnionSchema(options),
  coerce: {
    string: (opts) => new StringSchema({ ...opts, coerce: true }),
    number: (opts) => new NumberSchema({ ...opts, coerce: true }),
    boolean: (opts) => new BooleanSchema({ ...opts, coerce: true })
  }
};

module.exports = { g };