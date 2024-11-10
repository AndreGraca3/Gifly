import React from "react";
import { toast } from "react-toastify";
import { Gif } from "../domain/Gif";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";

export default function GifItem({
  gif,
  isFavorited,
  toggleFavorite,
}: {
  gif: Gif;
  isFavorited: boolean;
  toggleFavorite: () => void;
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
      className="gif-item group relative min-w-[50%] min-h-[100px] bg-[#40444b] rounded-lg p-1 transition-transform transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer overflow-hidden"
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
        className="focus:outline-0 absolute top-4 left-3 text-xl select-none ring-0 cursor-pointer hover:scale-125 hover:text-yellow-300 transition-all group-hover:opacity-100 opacity-0"
      >
        <FaShareAlt stroke="black" strokeWidth={4} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        tabIndex={-1}
        className={`focus:outline-0 absolute top-4 right-3 text-xl select-none ring-0 cursor-pointer hover:scale-125 transition-all ${
          isFavorited ? "" : "group-hover:opacity-100 opacity-0"
        }`}
      >
        {isFavorited ? <FaHeart fill="red" /> : <FaRegHeart fill="red" />}
      </button>

      <img
        ref={imgRef}
        src={gif.url}
        alt="GIF"
        className="w-full h-auto rounded-md object-cover"
      />
    </div>
  );
}
