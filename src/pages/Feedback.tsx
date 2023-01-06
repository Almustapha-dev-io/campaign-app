import { VStack } from '@chakra-ui/react';
import AddFeedback from 'components/feedbacks/AddFeedback';
import FeedbackActions from 'components/feedbacks/FeedbackActions';
import FeedbacksList from 'components/feedbacks/FeedbacksList';
import FeedbackContextProvider from 'contexts/feedback';
import useAuth from 'hooks/useAuth';
import useRoles from 'hooks/useRoles';
import { Roles } from 'types/roles';

function Feedback() {
  useRoles(new Set([Roles.SuperAdmin, Roles.ObservationRoomAgent]));
  const { userDetails } = useAuth();

  return (
    <FeedbackContextProvider>
      {!!userDetails && <AddFeedback user={userDetails} />}
      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="14" align="flex-start">
        <FeedbackActions />
        <FeedbacksList />
      </VStack>
    </FeedbackContextProvider>
  );
}

export default Feedback;
