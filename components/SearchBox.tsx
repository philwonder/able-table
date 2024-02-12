import React, { CSSProperties, useRef } from "react";
import { isFunction } from "../utilities/isType";

type SearchBoxProps = {
  onChange: (value: string) => void;
  styles: CSSProperties | ((value: string) => CSSProperties) | undefined;
  classes: string | ((value: string) => string) | undefined;
};

export function SearchBox({ onChange, styles, classes }: SearchBoxProps) {
  const value = useRef<string>("");
  return (
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
  );
}
