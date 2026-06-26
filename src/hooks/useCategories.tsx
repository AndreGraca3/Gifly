import { useCallback, useEffect, useState } from "react";
import { Category } from "../domain/Category";
import { Gif } from "../domain/Gif";

const COLORS = [
  "#f87171", "#fb923c", "#fbbf24", "#a3e635",
  "#34d399", "#38bdf8", "#818cf8", "#e879f9",
];

type GifCategoryMap = Record<string, string[]>; // gifUrl -> categoryId[]

export type UseCategories = {
  categories: Category[];
  createCategory: (name: string) => string;
  deleteCategory: (id: string) => void;
  getGifCategoryIds: (gifUrl: string) => string[];
  getGifCategoryColors: (gifUrl: string) => string[];
  toggleGifCategory: (gifUrl: string, categoryId: string) => void;
  filterByCategory: (gifs: Gif[], categoryId: string | null) => Gif[];
};

export default function useCategories(): UseCategories {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("gif-categories") || "[]");
    } catch {
      return [];
    }
  });

  const [gifCategoryMap, setGifCategoryMap] = useState<GifCategoryMap>(() => {
    try {
      return JSON.parse(localStorage.getItem("gif-category-map") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("gif-categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("gif-category-map", JSON.stringify(gifCategoryMap));
  }, [gifCategoryMap]);

  const createCategory = useCallback((name: string): string => {
    const id = crypto.randomUUID();
    setCategories((prev) => {
      const color = COLORS[prev.length % COLORS.length];
      return [...prev, { id, name: name.trim(), color }];
    });
    return id;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setGifCategoryMap((prev) => {
      const updated = { ...prev };
      for (const gifUrl in updated) {
        updated[gifUrl] = updated[gifUrl].filter((cId) => cId !== id);
      }
      return updated;
    });
  }, []);

  const getGifCategoryIds = useCallback(
    (gifUrl: string): string[] => gifCategoryMap[gifUrl] ?? [],
    [gifCategoryMap]
  );

  const getGifCategoryColors = useCallback(
    (gifUrl: string): string[] => {
      const ids = gifCategoryMap[gifUrl] ?? [];
      return ids
        .map((id) => categories.find((c) => c.id === id)?.color)
        .filter(Boolean) as string[];
    },
    [gifCategoryMap, categories]
  );

  const toggleGifCategory = useCallback(
    (gifUrl: string, categoryId: string) => {
      setGifCategoryMap((prev) => {
        const current = prev[gifUrl] ?? [];
        const has = current.includes(categoryId);
        return {
          ...prev,
          [gifUrl]: has
            ? current.filter((id) => id !== categoryId)
            : [...current, categoryId],
        };
      });
    },
    []
  );

  const filterByCategory = useCallback(
    (gifs: Gif[], categoryId: string | null): Gif[] => {
      if (!categoryId) return gifs;
      return gifs.filter((gif) =>
        (gifCategoryMap[gif.url] ?? []).includes(categoryId)
      );
    },
    [gifCategoryMap]
  );

  return {
    categories,
    createCategory,
    deleteCategory,
    getGifCategoryIds,
    getGifCategoryColors,
    toggleGifCategory,
    filterByCategory,
  };
}
