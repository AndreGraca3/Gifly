import React from "react";
import { toast } from "react-toastify";
import { Gif } from "../domain/Gif";
import { FaHeart, FaRegHeart, FaShareAlt, FaTag } from "react-icons/fa";

export default function GifItem({
  gif,
  isFavorited,
  toggleFavorite,
  onAssignCategories,
  gifCategoryColors,
}: {
  gif: Gif;
  isFavorited: boolean;
  toggleFavorite: () => void;
  onAssignCategories?: () => void;
  gifCategoryColors?: string[];
}) {
  const imgRef = React.useRef(null);

  // scuffed way as hell but it works
  const copyToClipboard = async () => {
    const img = imgRef.current;

    // Select the image
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(img);
    window.getSelection().addRange(range);

    const copied: boolean = await (window as any).api.copyToClipboard();

    window.getSelection().removeAllRanges();

    if (copied && (await navigator.clipboard.readText()) === "GIF") {
      toast.clearWaitingQueue();
      toast("🖼️ Copied GIF to clipboard!");
    }
  };

  return (
    <div
      data-tooltip-id="my-tooltip"
      data-tooltip-content={gif.name}
      data-tooltip-place="top"
      data-tooltip-delay-show={1000}
      onClick={copyToClipboard}
      className="gif-item group relative min-w-[50%] min-h-[100px] bg-gray-200 dark:bg-[#40444b] rounded-lg p-1 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(gif.url).then(() => {
            toast.clearWaitingQueue();
            toast("🔗 Copied url to clipboard!");
          });
        }}
        tabIndex={-1}
        className="focus:outline-0 absolute top-4 left-3 text-xl select-none ring-0 cursor-pointer hover:scale-125 hover:text-yellow-400 dark:hover:text-yellow-300 text-white transition-all group-hover:opacity-100 opacity-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.9))]"
      >
        <FaShareAlt />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        tabIndex={-1}
        className={`focus:outline-0 absolute top-4 right-3 text-xl select-none ring-0 cursor-pointer hover:scale-125 transition-all [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.9))] ${
          isFavorited ? "" : "group-hover:opacity-100 opacity-0"
        }`}
      >
        {isFavorited ? <FaHeart fill="red" /> : <FaRegHeart fill="white" stroke="red" strokeWidth={20} />}
      </button>

      {onAssignCategories && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAssignCategories();
          }}
          tabIndex={-1}
          className="focus:outline-0 absolute bottom-3 left-3 text-base select-none ring-0 cursor-pointer hover:scale-125 hover:text-yellow-400 dark:hover:text-yellow-300 text-white transition-all group-hover:opacity-100 opacity-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.9))]"
        >
          <FaTag />
        </button>
      )}

      {gifCategoryColors && gifCategoryColors.length > 0 && (
        <div className="absolute bottom-2.5 right-2.5 flex gap-1">
          {gifCategoryColors.map((color, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      <img
        ref={imgRef}
        src={gif.url}
        alt="GIF"
        className="w-full h-auto rounded-md object-cover"
      />
    </div>
  );
}
