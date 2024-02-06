import React from "react";

type SearchBoxProps = {
  value: string;
  updateValue: (value: string) => void;
};

export function SearchBox({ value, updateValue }: SearchBoxProps) {
  return (
    <input
      type="search"
      placeholder="Search"
      onChange={(e) => updateValue(e.target.value)}
      value={value}
    />
  );
}
