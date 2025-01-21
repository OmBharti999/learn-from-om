"use client";

import Confetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti";

export const ConfettiProvider = () => {
  const { isOpen, onClose, onOpen } = useConfettiStore();

  if (!isOpen) return null;
  return (
    <Confetti
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={onClose}
      className="pointer-events-none z-[1000000000000000000000]"
    />
  );
};
