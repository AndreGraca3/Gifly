import { useEffect, useRef, useState } from "react";
import { Category } from "../domain/Category";
import { FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SCROLL_AMOUNT = 160;

export default function UserCategoryTabs({
  categories,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCreating) inputRef.current?.focus();
  }, [isCreating]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [categories]);

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const handleCreate = () => {
    if (newName.trim()) onCreate(newName.trim());
    setNewName("");
    setIsCreating(false);
  };

  const tabBase =
    "flex-shrink-0 px-3 py-1.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all duration-200 select-none";
  const tabInactive =
    "bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/20 dark:hover:bg-white/20 hover:scale-105";
  const tabActive =
    "bg-yellow-400 text-black font-semibold scale-105 shadow-md";

  const arrowBtn =
    "flex-shrink-0 p-1 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-all cursor-pointer";

  if (categories.length === 0 && !isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
      >
        <FaPlus className="text-xs" />
        New collection
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 w-full">
      {canScrollLeft && (
        <button onClick={() => scrollBy("left")} className={arrowBtn} aria-label="Scroll left">
          <FaChevronLeft className="text-xs" />
        </button>
      )}

      <div ref={scrollRef} className="overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
        <div className="inline-flex gap-2 pb-0.5 items-center min-w-full">
          <button
            onClick={() => onSelect(null)}
            className={`${tabBase} ${activeId === null ? tabActive : tabInactive}`}
          >
            All
          </button>

          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelect(activeId === cat.id ? null : cat.id)}
              className={`group flex items-center gap-1.5 ${tabBase} ${
                activeId === cat.id ? tabActive : tabInactive
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cat.id);
                }}
                className="ml-0.5 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer"
                aria-label={`Delete ${cat.name}`}
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          ))}

          {isCreating ? (
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewName("");
                }
              }}
              onBlur={handleCreate}
              placeholder="Collection name…"
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none border border-yellow-400 w-36"
            />
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="p-1.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              aria-label="New collection"
            >
              <FaPlus className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {canScrollRight && (
        <button onClick={() => scrollBy("right")} className={arrowBtn} aria-label="Scroll right">
          <FaChevronRight className="text-xs" />
        </button>
      )}
    </div>
  );
}

