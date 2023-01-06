import { useDisclosure } from '@chakra-ui/react';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { TVoter } from 'types/voter';

type TVoterContext = {
  viewOpen: boolean;
  onViewOpen(): void;
  onViewClose(): void;
  selectedVoterToView: TVoter | null;
  editOpen: boolean;
  onEditOpen(): void;
  onEditClose(): void;
  selectedVoterToEdit: TVoter | null;
  setSelectedVoter(data: { voter: TVoter | null; isEdit?: boolean }): void;
};

export const VoterContext = createContext<TVoterContext>({
  editOpen: false,
  onEditClose() {},
  onEditOpen() {},
  viewOpen: false,
  onViewClose() {},
  onViewOpen() {},
  selectedVoterToView: null,
  selectedVoterToEdit: null,
  setSelectedVoter() {},
});

function VoterContextProvider({ children }: PropsWithChildren) {
  const {
    isOpen: viewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const {
    isOpen: editOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [viewVoter, setViewVoter] = useState<TVoter | null>(null);
  const [editVoter, setEditVoter] = useState<TVoter | null>(null);

  const setSelectedVoter = useCallback(
    ({ isEdit, voter }: { voter: TVoter | null; isEdit?: boolean }) => {
      if (isEdit) {
        setEditVoter(() => voter);
        return;
      }

      setViewVoter(() => voter);
    },
    []
  );

  return (
    <VoterContext.Provider
      value={{
        editOpen,
        onEditClose,
        onEditOpen,
        viewOpen,
        onViewClose,
        onViewOpen,
        selectedVoterToEdit: editVoter,
        selectedVoterToView: viewVoter,
        setSelectedVoter,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
}

export default VoterContextProvider;
