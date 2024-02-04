import { ReactNode } from "react";

export type AbleAction = {
  render: ReactNode;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
};
