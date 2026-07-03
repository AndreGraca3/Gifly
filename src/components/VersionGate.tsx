import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  currentVersion: string;
  requiredVersion: string;
}

export default function VersionGate({ currentVersion, requiredVersion }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-6 text-center">
      <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
      <h1 className="text-xl font-bold mb-2">Update Required</h1>
      <p className="text-gray-300 text-sm mb-1">
        Your version <span className="font-semibold text-white">v{currentVersion}</span> is no
        longer supported.
      </p>
      <p className="text-gray-300 text-sm">
        Please update to at least{" "}
        <span className="font-semibold text-white">v{requiredVersion}</span> to continue.
      </p>
    </div>
  );
}
