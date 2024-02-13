import { CSSProperties, ReactNode } from "react";

export type AbleAction = {
  /**
   * A ReactNode which populates the action.
   */
  render: ReactNode;
  onClick: () => void;
  // tooltip?: string; //not implemented yet
  disabled?: boolean;
  /**
   * Styles applied to the action.
   * Overrides the styles tableAction prop.
   */
  cellStyle?: CSSProperties;
};
