export type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends Array<any>
    ? `${Key}`
    : T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
    : `${Key}`;
}[keyof T & string];

export type NestedValueOf<
  D extends {},
  T extends NestedKeyOf<D>
> = T extends `${infer First}.${infer Rest}`
  ? First extends keyof D
    ? D[First] extends {}
      ? Rest extends NestedKeyOf<D[First]>
        ? NestedValueOf<D[First], Rest>
        : never
      : never
    : never
  : T extends keyof D
  ? D[T]
  : never;

export type FieldValue<T extends {}> = {
  [K in NestedKeyOf<T>]: [K, NestedValueOf<T, K>];
}[NestedKeyOf<T>];

export type OneOf<T extends object> = {
  [K in keyof T]: { [key in Exclude<keyof T, K>]?: undefined } & Pick<T, K>;
}[keyof T];
