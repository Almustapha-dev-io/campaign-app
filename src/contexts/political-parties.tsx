import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { TPoliticalParty } from 'types/political-party';

type TPoliticalPartyContext = {
  selectPoliticalParty: TPoliticalParty | null;
  setSelectedPoliticalParty(party: TPoliticalParty | null): void;
};

export const PoliticalPartyContext = createContext<TPoliticalPartyContext>({
  selectPoliticalParty: null,
  setSelectedPoliticalParty(party) {},
});

function PoliticalPartyContextProvider({ children }: PropsWithChildren) {
  const [politicalParty, setPoliticalParty] = useState<TPoliticalParty | null>(
    null
  );

  const setSelectedPoliticalParty = useCallback(
    (_party: TPoliticalParty | null) => {
      setPoliticalParty(() => _party);
    },
    []
  );

  return (
    <PoliticalPartyContext.Provider
      value={{
        selectPoliticalParty: politicalParty,
        setSelectedPoliticalParty,
      }}
    >
      {children}
    </PoliticalPartyContext.Provider>
  );
}

export default PoliticalPartyContextProvider;
