import { Stack, Heading, VStack } from '@chakra-ui/react';
import EditProfileForm from 'components/Profile/EditProfileForm';
import useAuth from 'hooks/useAuth';

function Profile() {
  const { userDetails } = useAuth();

  return (
    <VStack w="full" py={{ base: 4, lg: 12 }} spacing="10">
      <Stack
        w="full"
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'flex-start', md: 'space-between' }}
        align={{ base: 'flex-start', md: 'center' }}
      >
        <Heading fontSize="3xl">Profile</Heading>
      </Stack>

      {!!userDetails && <EditProfileForm user={userDetails} />}
    </VStack>
  );
}

export default Profile;
