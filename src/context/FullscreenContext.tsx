"use client";

import { createContext, useContext, useState } from "react";

type FullscreenContextType = {
  fullscreen: boolean;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
};

const FullscreenContext = createContext<FullscreenContextType | null>(null);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => setFullscreen((prev) => !prev);

  return (
    <FullscreenContext.Provider value={{ fullscreen, toggleFullscreen, setFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (!context) throw new Error("useFullscreen must be used inside FullscreenProvider");
  return context;
};
