import { NestedKeyOf } from "./types";

export function getField<T extends object>(object: T, path: NestedKeyOf<T> | undefined) {
  const keys = path?.split(".") ?? [];
  let result: any = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}
