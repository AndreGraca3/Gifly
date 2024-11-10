import Masonry from "react-masonry-css";
import { Gif } from "../domain/Gif";
import GifItem from "./GifItem";

export default function GifList({
  gifs,
  isFavorited,
  toggleFavorite,
}: {
  gifs: Gif[];
  isFavorited: (gif: Gif) => boolean;
  toggleFavorite: (gif: Gif) => void;
}) {
  return (
    <Masonry
      breakpointCols={2}
      className="gif-list flex gap-4 p-2"
      columnClassName="space-y-4"
    >
      {gifs.map((gif) => {
        return (
          <GifItem
            key={gif.url}
            gif={gif}
            isFavorited={isFavorited(gif)}
            toggleFavorite={() => toggleFavorite(gif)}
          />
        );
      })}
    </Masonry>
  );
}
