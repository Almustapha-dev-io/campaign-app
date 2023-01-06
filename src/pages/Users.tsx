import { useDisclosure, VStack } from '@chakra-ui/react';
import AddUser from 'components/users/AddUser';
import UserActions from 'components/users/UserActions';
import UsersList from 'components/users/UsersList';
import UserContextProvider from 'contexts/user';

function Users() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <UserContextProvider>
      <AddUser isOpen={isOpen} onClose={onClose} />
      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="24">
        <UserActions onOpen={onOpen} />
        <UsersList onOpen={onOpen} />
      </VStack>
    </UserContextProvider>
  );
}

export default Users;
