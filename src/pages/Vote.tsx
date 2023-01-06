import { VStack } from '@chakra-ui/react';
import AddVote from 'components/votes/AddVote';
import VotesAction from 'components/votes/VotesAction';
import VotesList from 'components/votes/VotesList';
import VoteContextProvider from 'contexts/vote';
import useAuth from 'hooks/useAuth';
import useRoles from 'hooks/useRoles';
import { Roles } from 'types/roles';

function Vote() {
  useRoles(new Set([Roles.SuperAdmin, Roles.PartyAgent]));
  const { userDetails } = useAuth();

  return (
    <VoteContextProvider>
      {!!userDetails && <AddVote user={userDetails} />}
      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="14" align="flex-start">
        <VotesAction />
        <VotesList />
      </VStack>
    </VoteContextProvider>
  );
}

export default Vote;
