import { AbleRowGroup } from "../types/AbleRowGroup";

export function getRowHeaderColSpan<T extends object>(groups: AbleRowGroup<T>[]): number {
  let span = Math.max(0, ...groups.map((g) => g.colspan));
  if (span !== 1) return span;
  return groups[0].subGroups ? getRowHeaderColSpan(groups[0].subGroups) + 1 : 1;
}
