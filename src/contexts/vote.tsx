import { useDisclosure } from '@chakra-ui/react';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { TVote } from 'types/vote';

export type TVoteContext = {
  isOpen: boolean;
  onOpen(): any;
  onClose(): any;
  selectedVote: TVote | null;
  setSelectedVote(vote: TVote | null): void;
};

export const VoteContext = createContext<TVoteContext>({
  isOpen: false,
  onClose() {},
  onOpen() {},
  selectedVote: null,
  setSelectedVote() {},
});

function VoteContextProvider({ children }: PropsWithChildren) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [vote, setVote] = useState<TVote | null>(null);

  const setSelectedVote = useCallback((_vote: TVote | null) => {
    setVote(() => _vote);
  }, []);

  return (
    <VoteContext.Provider
      value={{
        isOpen,
        onClose,
        onOpen,
        selectedVote: vote,
        setSelectedVote,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
}

export default VoteContextProvider;
