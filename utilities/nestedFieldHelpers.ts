import { ReactNode } from "react";
import { NestedKeyOf } from "../types/UtitlityTypes";

export function getField<T extends object>(object: T, path: NestedKeyOf<T>): ReactNode {
  const keys = path.split(".");
  let result: any = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}

export function searchByField<T extends object>(
  filter: any,
  data: T,
  fields: NestedKeyOf<T>[]
): boolean {
  return fields.some((f) =>
    `${getField(data, f)}`.toLowerCase().includes(filter.toLowerCase())
  );
}

export function flatten(object: object) {}
