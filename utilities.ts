import { AbleColumn, AbleColumnGroup, NestedKeyOf } from "./types";

export function getField<T extends object>(object: T, path: NestedKeyOf<T> | undefined) {
  const keys = path?.split(".") ?? [];
  let result: any = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}

export const searchByField = <T extends object>(
  filter: any,
  data: T,
  fields: NestedKeyOf<T>[]
): boolean =>
  fields.some((f) =>
    getField(data, f).toString().toLowerCase().includes(filter.toLowerCase())
  );
