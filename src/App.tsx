import { useState } from "react";
import Header from "./components/Header/Header";
import GifSection from "./components/GifSection";
import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useDebounce } from "use-debounce";
import { createRoot } from "react-dom/client";
import TenorApi from "./api/TenorApi";

console.log("env from window: " + (window as any).env.TENOR_API_KEY);

const tenorApi = new TenorApi((window as any).env.TENOR_API_KEY);

export default function App() {
  const [query, setQuery] = useState("");
  const [queryValue] = useDebounce(query, 1000);

  return (
    <div>
      <Header onSearch={setQuery} />

      <section className="mt-20 overflow-visible">
        <GifSection query={queryValue} gifApi={tenorApi} />
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
    </div>
  );
}

function render() {
  const root = createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();
