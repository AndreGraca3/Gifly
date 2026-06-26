import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 200;

export default function useScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      setShowButton(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return [scrollToTop, showButton] as const;
}
