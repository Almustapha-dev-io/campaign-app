import { WarningIcon } from '@chakra-ui/icons';
import { Center, Heading, Text, VStack } from '@chakra-ui/react';
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

  if (!userDetails) {
    return null;
  }

  if (
    !userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin) &&
    !userDetails.pollingUnit
  ) {
    return (
      <Center w="full" h="500px">
        <VStack w="full" spacing="4">
          <WarningIcon color="red.500" fontSize="6xl" />
          <Text textAlign="center" fontWeight="bold">
            All Party Agents Must be assigned to a Polling Unit. <br />
            Contact Admin
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VoteContextProvider>
      <AddVote user={userDetails} />
      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="10" align="flex-start">
        <VotesAction />
        <VotesList />
      </VStack>
    </VoteContextProvider>
  );
}

export default Vote;
