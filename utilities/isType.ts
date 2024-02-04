export function hasKey<T extends object>(data: T): data is T & { key: string | number } {
  const key = data["key" as keyof T];
  return typeof key == "number" || typeof key == "string";
}
