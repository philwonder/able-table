import { AbleColumn } from "../types/AbleColumn";

export function fromMatrix(matrix: any[][]) {
  const [headerRow] = matrix.slice(0, 1);
  const data = matrix
    .slice(1)
    .map((r) => Object.fromEntries(r.map((_, i) => [headerRow[i], r[i]])));
  const columns: AbleColumn<(typeof data)[0]>[] = headerRow.map((v) => ({
    field: v,
    header: v,
  }));
  return { data, columns };
}
