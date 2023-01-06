import { AddIcon } from '@chakra-ui/icons';
import { Button, Heading, Stack } from '@chakra-ui/react';
import { VoteContext } from 'contexts/vote';
import useAuth from 'hooks/useAuth';
import { useContext } from 'react';
import { Roles } from 'types/roles';
import hasRoles from 'utilities/hasRole';

function VotesAction() {
  const { onOpen } = useContext(VoteContext);
  const { userDetails } = useAuth();

  if (!userDetails) {
    return null;
  }

  return (
    <Stack
      w="full"
      direction={{ base: 'column', md: 'row' }}
      justify={{ base: 'flex-start', md: 'space-between' }}
      align={{ base: 'flex-start', md: 'center' }}
    >
      <Heading fontSize="3xl">Votes</Heading>
      {hasRoles(userDetails, new Set([Roles.PartyAgent])) && (
        <Button
          w={{ base: 'full', md: 'auto' }}
          leftIcon={<AddIcon />}
          onClick={onOpen}
        >
          Add vote
        </Button>
      )}
    </Stack>
  );
}

export default VotesAction;
