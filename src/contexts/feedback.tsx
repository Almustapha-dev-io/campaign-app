import { useDisclosure } from '@chakra-ui/react';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { TFeedback } from 'types/feedback';

export type TFeedbackContext = {
  isOpen: boolean;
  onOpen(): any;
  onClose(): any;
  selectedFeedback: TFeedback | null;
  setSelectedFeedback(feedback: TFeedback | null): void;
};

export const FeedbackContext = createContext<TFeedbackContext>({
  isOpen: false,
  onClose() {},
  onOpen() {},
  selectedFeedback: null,
  setSelectedFeedback() {},
});

function FeedbackContextProvider({ children }: PropsWithChildren) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [feedback, setFeedback] = useState<TFeedback | null>(null);

  const setSelectedFeedback = useCallback((_feedback: TFeedback | null) => {
    setFeedback(() => _feedback);
  }, []);

  return (
    <FeedbackContext.Provider
      value={{
        isOpen,
        onClose,
        onOpen,
        selectedFeedback: feedback,
        setSelectedFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export default FeedbackContextProvider;
