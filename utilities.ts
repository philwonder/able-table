import { AbleColumn, AbleColumnGroup, NestedKeyOf } from "./types";

export function getField<T extends object>(object: T, path: NestedKeyOf<T> | undefined) {
  const keys = path?.split(".") ?? [];
  let result: any = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}

export function hasKey<T extends object>(data: T): data is T & { key: string | number } {
  const key = data["key" as keyof T];
  return typeof key == "number" || typeof key == "string";
}

export const searchByField = <T extends object>(
  filter: any,
  data: T,
  fields: NestedKeyOf<T>[]
): boolean =>
  fields.some((f) =>
    getField(data, f).toString().toLowerCase().includes(filter.toLowerCase())
  );
