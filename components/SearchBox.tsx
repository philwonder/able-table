import React, { CSSProperties, useRef } from "react";
import { isFunction } from "../utilities/isType";

export type SearchBoxProps = {
  onChange: (value: string) => void;
  styles: CSSProperties | ((value: string) => CSSProperties) | undefined;
  classes: string | ((value: string) => string) | undefined;
};

export function SearchBox({
  onChange,
  styles,
  classes,
  override: Override,
}: SearchBoxProps & { override: React.FC<SearchBoxProps> | undefined }) {
  const value = useRef<string>("");
  return !Override ? (
    <input
      type="search"
      placeholder="Search"
      onChange={(e) => {
        value.current = e.target.value;
        onChange(e.target.value);
      }}
      style={isFunction(styles) ? styles(value.current) : styles}
      className={`AbleTable-Search ${isFunction(classes) ? classes(value.current) : classes}`}
    />
  ) : (
    <Override onChange={onChange} styles={styles} classes={classes} />
  );
}
