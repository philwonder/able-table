import { AbleColumn } from "./AbleColumn";

export type AbleClasses<T extends object> = {
  /**
   * Classes applied to the root \<div> element.
   */
  container?: string;
  /**
   * Classes applied to the \<table> element.
   */
  table?: string;
  /**
   * Classes applied to the \<tbody> element.
   */
  tableBody?: string;
  /**
   * Classes applied to the \<thead> element.
   */
  tableHead?: string;
  /**
   * Classes applied to the \<tfoot> element.
   */
  tableFoot?: string;
  /**
   * Classes applied to the \<tr> elements in \<tbody>.
   */
  tableRow?: string | ((d?: T, i?: number) => string);
  /**
   * Classes applied to the \<th> elements.
   * Overridden by column headerClasses prop.
   */
  tableHeader?: string | ((c?: AbleColumn<T>, i?: number) => string);
  /**
   * Classes applied to the \<td> elements.
   * Overridden by column cellClasses prop.
   */
  tableCell?: string | ((c?: AbleColumn<T>, i?: number) => string);
  /**
   * Classes applied to the search box.
   */
  searchBox?: string | ((value: string) => string);
  pagination?: string;
};
