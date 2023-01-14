import { Heading, VStack } from '@chakra-ui/react';
import AddOfflineVote from 'components/OfflineMode/AddOfflineVote';
import OfflineVotes from 'components/OfflineMode/OfflineVotes';
import { useCallback, useEffect, useState } from 'react';
import { TOfflineVote } from 'types/vote';
import { getOfflineVotes, setOfflineVotes } from 'utilities/offline-helpers';

function OfflineMode() {
  const [votes, setVotes] = useState<TOfflineVote[]>([]);

  useEffect(() => {
    setVotes(getOfflineVotes());
  }, []);

  const onAddVotes = useCallback((vote: TOfflineVote) => {
    setVotes((v) => {
      const voteIndex = v.findIndex((vI) => vI.party === vote.party);
      if (voteIndex > -1) {
        const copied = [...v];
        copied[voteIndex] = vote;
        setOfflineVotes(copied);
        return copied;
      } else {
        const copied = [...v];
        copied.push(vote);
        setOfflineVotes(copied);
        return copied;
      }
    });
  }, []);

  const onDeleteVote = useCallback((vote: TOfflineVote) => {
    setVotes((v) => {
      const copied = v.filter((v) => v.party !== vote.party);
      setOfflineVotes(copied);
      return copied;
    });
  }, []);

  return (
    <VStack w="full" py={{ base: 4, lg: 12 }} spacing="12" align="flex-start">
      <Heading fontSize="3xl">Offline Recorded Votes</Heading>
      <AddOfflineVote onAddVotes={onAddVotes} />
      <OfflineVotes votes={votes} onDelete={onDeleteVote} />
    </VStack>
  );
}

export default OfflineMode;
