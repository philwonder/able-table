import { CSSProperties, ReactNode } from "react";
import { NestedKeyOf, OneOf } from "./UtitlityTypes";

export type AbleRowGroupDef<T extends object> = {
  /**
   * Styles applied to the row group's \<th> elements.
   * - Overrides the styles.tableHeader prop.
   * - Overrides the column group's headerStyle prop.
   */
  headerStyle?: CSSProperties | ((c?: AbleRowGroup<T>, i?: number) => CSSProperties);
  /**
   * Styles applied to the row group's \<tr> elements.
   * - Overridden by the styles.tableRow prop.
   */
  rowStyle?: CSSProperties | ((c?: AbleRowGroup<T>, i?: number) => CSSProperties);
} & (
  | {
      /**
       * The data field associated with this row group.
       * - The value of this field is used to populate the row header if no group function is provided.
       */
      field: NestedKeyOf<T>;
      /**
       * A function that returns a react node, which serves as the row header.
       * - If omitted, the field value is used.
       * - Required if the group has no associated field.
       */
      group?: (d: T) => ReactNode;
    }
  | {
      /**
       * A function that returns a react node, which serves as the row header.
       * - If omitted, the field value is used.
       * - Required if the group has no associated field.
       */
      group: (d: T) => ReactNode;
    }
);

export type AbleRowGroup<T extends object> = {
  header: ReactNode;
  rows?: (T & { key: string })[];
  subGroups?: AbleRowGroup<T>[];
  // colspan: number;
};
