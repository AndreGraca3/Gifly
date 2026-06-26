import { CATEGORIES } from "../domain/categories";

export default function CategoryPills({
  activeQuery,
  onSelect,
}: {
  activeQuery: string;
  onSelect: (query: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5">
      {CATEGORIES.map((cat) => {
        const isActive = activeQuery === cat.query;
        return (
          <button
            key={cat.query}
            onClick={() => onSelect(isActive ? "" : cat.query)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all duration-200
              ${
                isActive
                  ? "bg-yellow-400 text-black shadow-md scale-105 font-semibold"
                  : "bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/20 dark:hover:bg-white/20 hover:scale-105"
              }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
