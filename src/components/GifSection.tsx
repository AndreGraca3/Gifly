import { useEffect, useState } from "react";
import GifList from "./GifList";
import useGifs from "../hooks/useGifs";
import SearchBar from "./Header/SearchBar";
import useScrollToTop from "../hooks/useScrollToTop";
import GifApi from "../api/GifApi";
import InfiniteScroll from "react-infinite-scroll-component";
import useFavourites from "../hooks/useFavourites";

export default function GifSection({
  query,
  gifApi,
}: {
  query: string;
  gifApi: GifApi;
}) {
  const [gifs, fetchAndSetGifs, hasMoreGifs] = useGifs(gifApi, query);
  const [favorites, isFavorited, toggleFavorite] = useFavourites();

  const [scrollToTop] = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [query]);

  const [favouriteQuery, setFavouriteQuery] = useState("");

  const filteredFavorites = favorites.filter((f) => {
    const favouriteQueryL = favouriteQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(favouriteQueryL) ||
      f.tags.some((tag) => tag.toLowerCase().includes(favouriteQueryL))
    );
  });

  return (
    <div className="space-y-4">
      {query.length === 0 &&
        (favorites.length > 0 ? (
          <div className="flex w-full space-x-6 items-center mx-2">
            <h2 className="text-2xl text-white whitespace-nowrap">
              <span className="mx-1 text-yellow-300">
                {filteredFavorites.length}
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
          <p className="text-md text-gray-400 text-center">
            You don't have any favourite GIFs yet 😔
          </p>
        ))}

      <InfiniteScroll
        loader={<h4>Loading more...</h4>}
        hasMore={hasMoreGifs}
        next={() => fetchAndSetGifs()}
        dataLength={gifs.length}
        scrollThreshold={0.9}
      >
        <GifList
          gifs={query.length > 0 ? gifs : filteredFavorites}
          isFavorited={isFavorited}
          toggleFavorite={toggleFavorite}
        />
      </InfiniteScroll>
    </div>
  );
}
