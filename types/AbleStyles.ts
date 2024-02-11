import { CSSProperties } from "react";
import { AbleColumn } from "./AbleColumn";

export type AbleStyles<T extends object> = {
  /**
   * Styles applied to the root \<div> element.
   */
  container?: CSSProperties;
  /**
   * Styles applied to the \<table> element.
   */
  table?: CSSProperties;
  /**
   * Styles applied to the \<tbody> element.
   */
  tableBody?: CSSProperties;
  /**
   * Styles applied to the \<thead> element.
   */
  tableHead?: CSSProperties;
  /**
   * Styles applied to the \<tfoot> element.
   */
  tableFoot?: CSSProperties;
  /**
   * Styles applied to the \<tr> elements in \<tbody>.
   */
  tableRow?: CSSProperties | ((d?: T, i?: number) => CSSProperties);
  /**
   * Styles applied to the \<th> elements.
   * Overridden by column headerStyle prop.
   */
  tableHeader?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  /**
   * Styles applied to the \<td> elements.
   * Overridden by column cellStyle prop.
   */
  tableCell?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  /**
   * Styles applied to the search box.
   */
  searchBox?: CSSProperties | ((value: string) => CSSProperties);
  pagination?: CSSProperties;
};
