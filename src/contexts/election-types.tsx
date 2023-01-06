import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { TElectionType } from 'types/election-type';

type TElectionTypesContext = {
  selectedElectionType: TElectionType | null;
  setSelectedElectionType(electionType: TElectionType | null): void;
};

export const ElectionTypesContext = createContext<TElectionTypesContext>({
  selectedElectionType: null,
  setSelectedElectionType() {},
});

function ElectionTypesContextProvider({ children }: PropsWithChildren) {
  const [electionType, setElectionType] = useState<TElectionType | null>(null);

  const setSelectedElectionType = useCallback(
    (_electionType: TElectionType | null) => {
      setElectionType(() => _electionType);
    },
    []
  );

  return (
    <ElectionTypesContext.Provider
      value={{ selectedElectionType: electionType, setSelectedElectionType }}
    >
      {children}
    </ElectionTypesContext.Provider>
  );
}

export default ElectionTypesContextProvider;
