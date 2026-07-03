import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface Props {
  message: string;
}

export default function ErrorGate({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-6 text-center">
      <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
      <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
