import { useEffect, useRef, useState } from "react";
import { Category } from "../domain/Category";
import { FaPlus, FaTimes, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaTrash } from "react-icons/fa";

const SCROLL_AMOUNT = 160;

export default function UserCategoryTabs({
  categories,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onReorder,
}: {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (fromId: string, toId: string) => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  const scrollToEdge = (dir: "start" | "end") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: dir === "start" ? 0 : el.scrollWidth, behavior: "smooth" });
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
        <button onClick={() => scrollToEdge("start")} className={arrowBtn} aria-label="Scroll to start">
          <FaAngleDoubleLeft className="text-xs" />
        </button>
      )}
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
              draggable
              onDragStart={() => setDraggingId(cat.id)}
              onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
              onDragOver={(e) => { e.preventDefault(); setDragOverId(cat.id); }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggingId && draggingId !== cat.id) onReorder(draggingId, cat.id);
                setDraggingId(null);
                setDragOverId(null);
              }}
              onClick={() => onSelect(activeId === cat.id ? null : cat.id)}
              className={`group flex items-center gap-1.5 ${tabBase} ${
                activeId === cat.id ? tabActive : tabInactive
              } ${draggingId === cat.id ? "opacity-40" : ""} ${
                dragOverId === cat.id && draggingId !== cat.id ? "ring-2 ring-yellow-400" : ""
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
                  setPendingDeleteId(cat.id);
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
      {canScrollRight && (
        <button onClick={() => scrollToEdge("end")} className={arrowBtn} aria-label="Scroll to end">
          <FaAngleDoubleRight className="text-xs" />
        </button>
      )}

      {pendingDeleteId && (() => {
        const cat = categories.find((c) => c.id === pendingDeleteId)!;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setPendingDeleteId(null)}
          >
            <div
              className="bg-white dark:bg-[#36393f] rounded-2xl p-6 shadow-2xl w-72 transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-red-500 text-xl">
                  <FaTrash />
                </span>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Delete collection
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {cat.name}
                </span>
                ? This cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setPendingDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-sm bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(pendingDeleteId);
                    setPendingDeleteId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm bg-red-500 hover:bg-red-600 text-white font-semibold transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

