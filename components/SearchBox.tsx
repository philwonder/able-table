import React from "react";

type SearchBoxProps = {
  onChange: (value: string) => void;
};

export function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <input
      type="search"
      placeholder="Search"
      onChange={(e) => onChange(e.target.value)}
      style={{ lineHeight: "30px" }}
    />
  );
}
