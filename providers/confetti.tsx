"use client";

import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import { useConfettiStore } from "@/hooks/use-confetti";

export const ConfettiProvider = () => {
  const { isOpen } = useConfettiStore();

  if (!isOpen) return null;
  return (
    <Fireworks
      autorun={{ speed: 3 }}
      className="pointer-events-none z-[1000000000000000000000]"
      
    />
  );
};
