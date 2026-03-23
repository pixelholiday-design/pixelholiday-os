"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PixelHoliday Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-gray-400 mb-6">{error.message || "Something went wrong"}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
