import React, { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const onInputChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value); // Call the onSearch prop with the current input value
  };

  return (
    <header className="flex fixed top-0 left-0 right-0 bg-[#40444b] p-4 h-20 items-center z-50">
      <SearchBar
        value={searchTerm}
        placeholder="Search for GIFs"
        onChange={onInputChange}
        theme="darker"
      />
    </header>
  );
}
