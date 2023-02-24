import { useContext, useState, createContext } from 'react';

const DrawerContext = createContext();

export function useDrawer() {
  return useContext(DrawerContext);
}

export function DrawerProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState({
    left: false,
  });

  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const value = {
    setIsDrawerOpen,
    isDrawerOpen,
    isPostFormOpen,
    setIsPostFormOpen,
  };
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}
