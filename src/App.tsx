import { useState } from "react";
import Header from "./components/Header/Header";
import GifSection from "./components/GifSection";
import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useDebounce } from "use-debounce";
import { createRoot } from "react-dom/client";
import KlipyApi from "./api/KlipyApi";
import { ThemeProvider } from "./context/ThemeContext";

const gifApi = new KlipyApi((window as any).env.KLIPY_API_KEY);

export default function App() {
  const [query, setQuery] = useState("");
  const [queryValue] = useDebounce(query, 900);

  return (
    <ThemeProvider>
      <Header query={query} onQueryChange={setQuery} />

      <section className="mt-20 p-4 overflow-visible w-full">
        <GifSection query={queryValue} gifApi={gifApi} />
      </section>

      <ToastContainer
        className="p-8"
        position="bottom-center"
        theme="dark"
        limit={1}
        transition={Flip}
        autoClose={500}
        hideProgressBar={true}
      />

      <Tooltip id="my-tooltip" className="z-50" />
    </ThemeProvider>
  );
}

function render() {
  const root = createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();
