import { useEffect, useState } from "react";
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
import { compareVersions, VersionStatus } from "./utils/version";
import VersionGate from "./components/VersionGate";
import VersionBanner from "./components/VersionBanner";
import ErrorGate from "./components/ErrorGate";

const gifApi = new KlipyApi((window as any).env.KLIPY_API_KEY);

export default function App() {
  const [query, setQuery] = useState("");
  const [queryValue] = useDebounce(query, 900);
  const [versionStatus, setVersionStatus] = useState<VersionStatus>("ok");
  const [currentVersion, setCurrentVersion] = useState("");
  const [requiredVersion, setRequiredVersion] = useState("");
  const [criticalError, setCriticalError] = useState<string | null>(null);

  useEffect(() => {
    async function checkVersion() {
      try {
        const [current, required] = await Promise.all([
          (window as any).api.getAppVersion() as Promise<string>,
          (window as any).api.getRequiredVersion() as Promise<string>,
        ]);
        setCurrentVersion(current);
        setRequiredVersion(required);
        setVersionStatus(compareVersions(current, required));
      } catch (err) {
        setCriticalError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    }
    checkVersion();
  }, []);

  if (criticalError) {
    return (
      <ThemeProvider>
        <ErrorGate message={criticalError} />
      </ThemeProvider>
    );
  }

  if (versionStatus === "major-outdated") {
    return (
      <ThemeProvider>
        <VersionGate currentVersion={currentVersion} requiredVersion={requiredVersion} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Header query={query} onQueryChange={setQuery} />

      {versionStatus === "minor-outdated" && (
        <div className="mt-20 px-0">
          <VersionBanner currentVersion={currentVersion} requiredVersion={requiredVersion} />
        </div>
      )}

      <section className={`${versionStatus === "minor-outdated" ? "mt-2" : "mt-20"} p-4 overflow-visible w-full`}>
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
