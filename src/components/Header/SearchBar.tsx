import React from "react";

export default function SearchBar({
  value,
  placeholder,
  onChange,
  theme = "dark",
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  theme?: "dark" | "darker";
}) {
  const inputRef = React.useRef(null);

  const bgClass =
    theme === "darker"
      ? "bg-black/10 dark:bg-[#0f1014]"
      : "bg-black/10 dark:bg-[#1a1d22]";

  return (
    <div className="relative w-full max-w-xl">
      <input
        ref={inputRef}
        type="text"
        id="search"
        placeholder={placeholder}
        value={value}
        className={`w-full rounded-3xl border-none text-base ${bgClass} text-gray-900 dark:text-white outline-none text-center placeholder:text-gray-400 dark:placeholder:text-[rgb(167,168,171)] py-2 overflow-hidden transition-colors duration-300`}
        onInput={(e: any) => onChange(e.target.value)}
      />
      {value && (
        <span
          onClick={() => {
            onChange("");
            inputRef.current.focus();
          }}
          className="absolute right-3 top-1/2 transform -translate-y-2/4 cursor-pointer p-2 text-gray-500 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 text-xl transition-colors duration-200"
        >
          &times;
        </span>
      )}
    </div>
  );
}
