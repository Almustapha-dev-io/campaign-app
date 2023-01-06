import { AddIcon } from '@chakra-ui/icons';
import { Button, Heading, Stack } from '@chakra-ui/react';
import { FeedbackContext } from 'contexts/feedback';
import useAuth from 'hooks/useAuth';
import { useContext } from 'react';
import { Roles } from 'types/roles';
import hasRoles from 'utilities/hasRole';

function FeedbackActions() {
  const { onOpen } = useContext(FeedbackContext);
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
      <Heading fontSize="3xl">Media Feedback</Heading>
      {hasRoles(userDetails, new Set([Roles.ObservationRoomAgent])) && (
        <Button
          w={{ base: 'full', md: 'auto' }}
          leftIcon={<AddIcon />}
          onClick={onOpen}
        >
          Media Feedback
        </Button>
      )}
    </Stack>
  );
}

export default FeedbackActions;
