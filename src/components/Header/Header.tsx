import React from "react";
import SearchBar from "./SearchBar";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Header({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex fixed top-0 left-0 right-0 bg-gray-100 dark:bg-[#40444b] p-4 h-20 items-center gap-3 z-50 shadow-md transition-colors duration-300">
      <SearchBar
        value={query}
        placeholder="Search for GIFs"
        onChange={onQueryChange}
        theme="darker"
      />
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="flex-shrink-0 p-2.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        {theme === "dark" ? (
          <FaSun className="text-yellow-300 text-base" />
        ) : (
          <FaMoon className="text-gray-600 text-base" />
        )}
      </button>
    </header>
  );
}

