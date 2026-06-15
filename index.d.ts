export interface BaseSchema<T> {
  readonly _type: T;
}

export interface StringSchema extends BaseSchema<string> {
  min(size: number): this;
  max(size: number): this;
  uuid(): this;
  email(): this;
  optional(): BaseSchema<string | undefined>;
}

export interface NumberSchema extends BaseSchema<number> {
  min(val: number): this;
  max(val: number): this;
}

export interface BooleanSchema extends BaseSchema<boolean> {}

export interface ArraySchema<T extends BaseSchema<any>> extends BaseSchema<Array<T['_type']>> {}

export interface TupleSchema<T extends BaseSchema<any>[]> extends BaseSchema<{
  [K in keyof T]: T[K] extends BaseSchema<infer U> ? U : never;
}> {}

export interface RecordSchema<T extends BaseSchema<any>> extends BaseSchema<Record<string, T['_type']>> {}

export interface EnumSchema<T extends string> extends BaseSchema<T> {}

export interface UnionSchema<T extends BaseSchema<any>[]> extends BaseSchema<T[number]['_type']> {}

export interface ObjectSchema<Shape extends Record<string, BaseSchema<any>>> extends BaseSchema<{
  [K in keyof Shape]: Shape[K]['_type'];
}> {
  parse(data: any): this['_type'];
  parseStream(data: string): any;
}

export interface GutsEngine {
  object<Shape extends Record<string, BaseSchema<any>>>(shape: Shape): ObjectSchema<Shape>;
  string(): StringSchema;
  number(): NumberSchema;
  boolean(): BooleanSchema;
  coerce: {
    number(): NumberSchema;
    boolean(): BooleanSchema;
  };
  array<T extends BaseSchema<any>>(schema: T): ArraySchema<T>;
  tuple<T extends BaseSchema<any>[]>(schemas: [...T]): TupleSchema<T>;
  record<T extends BaseSchema<any>>(schema: T): RecordSchema<T>;
  enum<T extends string>(values: T[]): EnumSchema<T>;
  union<T extends BaseSchema<any>[]>(schemas: [...T]): UnionSchema<T>;
}

// Global engine entrypoint instance
export const g: GutsEngine;

// Real compile-time type extraction engine utility
export type Infer<T extends BaseSchema<any>> = T['_type'];