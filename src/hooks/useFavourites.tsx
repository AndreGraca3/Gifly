import { useCallback, useEffect, useState } from "react";
import { Gif } from "../domain/Gif";

export type UseFavorites = [Gif[], (gif: Gif) => boolean, (gif: Gif) => void];

export default function useGifs(): UseFavorites {
  const [favorites, setFavorites]: [Gif[], (favorites: Gif[]) => void] =
    useState(
      localStorage.getItem("favorites")
        ? JSON.parse(localStorage.getItem("favorites"))
        : []
    );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorited = useCallback(
    (gif: Gif) => {
      return favorites.some((favGif: Gif) => favGif.url === gif.url);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (gif: Gif) => {
      if (favorites.includes(gif)) {
        setFavorites(favorites.filter((favGif: Gif) => favGif.url !== gif.url));
      } else {
        setFavorites([gif, ...favorites]);
      }
    },
    [favorites]
  );

  return [favorites, isFavorited, toggleFavorite];
}
