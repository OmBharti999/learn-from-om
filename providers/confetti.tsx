"use client";

import Confetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti";

export const ConfettiProvider = () => {
  const { isOpen, onClose } = useConfettiStore();

  if (!isOpen) return null;
  return (
    <Confetti
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={onClose}
      className="pointer-events-none z-[9999]"
    />
  );
};
