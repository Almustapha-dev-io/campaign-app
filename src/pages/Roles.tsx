import { AddIcon } from '@chakra-ui/icons';
import { Button, Heading, Stack, VStack } from '@chakra-ui/react';
import RolesList from 'components/roles/RolesList';

function Roles() {
  return (
    <VStack w="full" py={{ base: 4, lg: 12 }} spacing="24">
      <Stack
        w="full"
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'flex-start', md: 'space-between' }}
        align={{ base: 'flex-start', md: 'center' }}
      >
        <Heading fontSize="3xl">Roles</Heading>
        {/* <Button w={{ base: 'full', md: 'auto' }} leftIcon={<AddIcon />}>
          Add Role
        </Button> */}
      </Stack>
      <RolesList />
    </VStack>
  );
}

export default Roles;
