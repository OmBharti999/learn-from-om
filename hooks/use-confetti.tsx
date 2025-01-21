import { create } from "zustand";

type ConfettiStore = {
  isOpen: boolean;
  // setIsOpen: (isOpen: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => ({
  isOpen: false,
  onOpen() {
    set({ isOpen: true });
  },
  onClose() {
    set({ isOpen: false });
  },
}));
