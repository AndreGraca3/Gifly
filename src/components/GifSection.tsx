import { useEffect, useState } from "react";
import GifList from "./GifList";
import useGifs from "../hooks/useGifs";
import SearchBar from "./Header/SearchBar";
import useScrollToTop from "../hooks/useScrollToTop";
import GifApi from "../api/GifApi";
import InfiniteScroll from "react-infinite-scroll-component";
import useFavourites from "../hooks/useFavourites";
import useCategories from "../hooks/useCategories";
import { PulseLoader } from "react-spinners";
import { FaArrowUp, FaExclamationTriangle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import UserCategoryTabs from "./UserCategoryTabs";
import CategoryAssignModal from "./CategoryAssignModal";
import { Gif } from "../domain/Gif";

export default function GifSection({
  query,
  gifApi,
}: {
  query: string;
  gifApi: GifApi;
}) {
  const { theme } = useTheme();
  const [gifs, fetchAndSetGifs, hasMoreGifs, isError] = useGifs(gifApi, query);
  const [favorites, isFavorited, toggleFavorite] = useFavourites();
  const {
    categories,
    createCategory,
    deleteCategory,
    getGifCategoryIds,
    getGifCategoryColors,
    toggleGifCategory,
    filterByCategory,
  } = useCategories();

  const [scrollToTop, showScrollButton] = useScrollToTop();
  const [favouriteQuery, setFavouriteQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [assigningGif, setAssigningGif] = useState<Gif | null>(null);

  useEffect(() => {
    scrollToTop();
  }, [query]);

  // Reset active category if it gets deleted
  useEffect(() => {
    if (activeCategoryId && !categories.find((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(null);
    }
  }, [categories, activeCategoryId]);

  const isFavoritesView = query.length === 0;

  const textFilteredFavorites = favorites.filter((f) => {
    const q = favouriteQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const displayedFavorites = filterByCategory(textFilteredFavorites, activeCategoryId);

  const handleCreateAndAssign = (name: string) => {
    if (!assigningGif) return;
    const newId = createCategory(name);
    toggleGifCategory(assigningGif.url, newId);
  };

  return (
    <div className="space-y-4">
      {isFavoritesView && (
        <>
          {favorites.length > 0 ? (
            <div className="flex w-full space-x-6 items-center mx-2">
              <h2 className="text-2xl text-gray-900 dark:text-white whitespace-nowrap">
                <span className="mx-1 text-yellow-500 dark:text-yellow-300">
                  {displayedFavorites.length}
                </span>
                favourites
              </h2>
              <SearchBar
                value={favouriteQuery}
                placeholder="Filter favourites"
                onChange={setFavouriteQuery}
                theme="dark"
              />
            </div>
          ) : (
            <p className="text-md text-gray-500 dark:text-gray-400 text-center">
              You don't have any favourite GIFs yet 😔
            </p>
          )}

          {favorites.length > 0 && (
            <UserCategoryTabs
              categories={categories}
              activeId={activeCategoryId}
              onSelect={setActiveCategoryId}
              onCreate={createCategory}
              onDelete={deleteCategory}
            />
          )}
        </>
      )}

      {isError && !isFavoritesView ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FaExclamationTriangle className="text-yellow-400 text-5xl" />
          <p className="text-gray-900 dark:text-white text-lg font-semibold">
            Oops! Something went wrong
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Couldn't load GIFs. Check your connection and try again.
          </p>
        </div>
      ) : (
        <InfiniteScroll
          loader={
            <PulseLoader
              className="flex w-full text-center py-2"
              color={theme === "dark" ? "white" : "#374151"}
            />
          }
          hasMore={hasMoreGifs}
          next={fetchAndSetGifs}
          dataLength={gifs.length}
          scrollThreshold={0.9}
        >
          <GifList
            gifs={isFavoritesView ? displayedFavorites : gifs}
            isFavorited={isFavorited}
            toggleFavorite={toggleFavorite}
            onAssignCategories={isFavoritesView ? setAssigningGif : undefined}
            getGifCategoryColors={isFavoritesView ? getGifCategoryColors : undefined}
          />
        </InfiniteScroll>
      )}

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-black/25 dark:bg-white/15 hover:bg-black/35 dark:hover:bg-white/25 backdrop-blur-sm text-gray-800 dark:text-white rounded-full p-3.5 shadow-xl border border-black/15 dark:border-white/20 transition-all hover:scale-110 cursor-pointer"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      {assigningGif && (
        <CategoryAssignModal
          gif={assigningGif}
          categories={categories}
          gifCategoryIds={getGifCategoryIds(assigningGif.url)}
          onToggle={(categoryId) => toggleGifCategory(assigningGif.url, categoryId)}
          onCreateAndAssign={handleCreateAndAssign}
          onClose={() => setAssigningGif(null)}
        />
      )}
    </div>
  );
}
