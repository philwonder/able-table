import { AbleRowGroup } from "../types/AbleRowGroup";

export function getRowGroupDepth<T extends object>(groups: AbleRowGroup<T>[]): number {
  let depth = Math.max(0, ...groups.map((g) => g.colspan));
  if (depth != 1) return depth;
  return groups[0].subGroups ? getRowGroupDepth(groups[0].subGroups) + 1 : 1;
}
