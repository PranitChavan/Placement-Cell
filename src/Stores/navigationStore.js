import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  isPostCreationFormOpen: false,
  togglePostCreationForm: () => set((state) => ({ isPostCreationFormOpen: !state.isPostCreationFormOpen })),

  confirmationDialogState: {
    isOpen: false,
    title: null,
    subTitle: null,
    onConfirm: null,
  },

  setAndToggleConfirmationDialog: ({ isOpen, title, subTitle, onConfirm }) =>
    set(() => ({ confirmationDialogState: { isOpen, title, subTitle, onConfirm } })),
}));

export default useNavigationStore;
