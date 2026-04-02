import { useState } from 'react';

export function useModal() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return {
    activeModal,
    openModal: (modalId: string) => setActiveModal(modalId),
    closeModal: () => setActiveModal(null)
  };
}
