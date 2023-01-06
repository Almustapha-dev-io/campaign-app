import { useDisclosure } from '@chakra-ui/react';
import { createContext, PropsWithChildren } from 'react';

type TLayoutContext = {
  sidebarOpen: boolean;
  toggleSidebar(): void;
};

export const LayoutContext = createContext<TLayoutContext>({
  sidebarOpen: false,
  toggleSidebar() {},
});

function LayoutContextProvider({ children }: PropsWithChildren) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <LayoutContext.Provider
      value={{ sidebarOpen: isOpen, toggleSidebar: onToggle }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export default LayoutContextProvider;
