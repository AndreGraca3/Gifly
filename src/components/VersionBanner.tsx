import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface Props {
  currentVersion: string;
  requiredVersion: string;
}

export default function VersionBanner({ currentVersion, requiredVersion }: Props) {
  return (
    <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs px-3 py-2 mx-4 mt-2 rounded-md">
      <FaExclamationCircle className="flex-shrink-0" />
      <span>
        Update available — v{currentVersion} → v{requiredVersion}. Please update soon.
      </span>
    </div>
  );
}
