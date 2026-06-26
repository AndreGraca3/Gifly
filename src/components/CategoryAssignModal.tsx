import { useState } from "react";
import { Gif } from "../domain/Gif";
import { Category } from "../domain/Category";
import { FaTimes, FaPlus } from "react-icons/fa";

export default function CategoryAssignModal({
  gif,
  categories,
  gifCategoryIds,
  onToggle,
  onCreateAndAssign,
  onClose,
}: {
  gif: Gif;
  categories: Category[];
  gifCategoryIds: string[];
  onToggle: (categoryId: string) => void;
  onCreateAndAssign: (name: string) => void;
  onClose: () => void;
}) {
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateAndAssign(newName.trim());
      setNewName("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white dark:bg-[#36393f] rounded-t-2xl p-4 shadow-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mr-4">
            Collections for{" "}
            <span className="text-yellow-500 dark:text-yellow-300">{gif.name}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors flex-shrink-0"
          >
            <FaTimes />
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            No collections yet. Create one below.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto">
            {categories.map((cat) => {
              const isAssigned = gifCategoryIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isAssigned}
                    onChange={() => onToggle(cat.id)}
                    className="accent-yellow-400 w-4 h-4 cursor-pointer"
                  />
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-100">
                    {cat.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            placeholder="New collection…"
            className="flex-1 px-3 py-2 rounded-xl text-sm bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none border border-transparent focus:border-yellow-400 transition-colors"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="px-3 py-2 rounded-xl bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
