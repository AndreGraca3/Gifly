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

  return (
    <div className="relative w-full max-w-xl">
      <input
        ref={inputRef}
        type="text"
        id="search"
        placeholder={placeholder}
        value={value}
        className={`w-full rounded-3xl border-none text-base ${
          theme === "darker" ? "bg-[#0f1014]" : "bg-[#1a1d22]"
        } text-white outline-none text-center placeholder:text-[rgb(167,168,171)] py-2 overflow-hidden`}
        onInput={(e: any) => onChange(e.target.value)}
      />
      {value && (
        <span
          onClick={() => {
            onChange("");
            inputRef.current.focus();
          }}
          className="absolute right-3 top-1/2 transform -translate-y-2/4 cursor-pointer p-2 text-white hover:text-yellow-400 text-xl"
        >
          &times;
        </span>
      )}
    </div>
  );
}
