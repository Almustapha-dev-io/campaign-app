import { AddIcon } from '@chakra-ui/icons';
import { Button, Heading, Stack } from '@chakra-ui/react';

type Props = {
  onOpen(): void;
};

function UserActions({ onOpen }: Props) {
  return (
    <Stack
      w="full"
      direction={{ base: 'column', md: 'row' }}
      justify={{ base: 'flex-start', md: 'space-between' }}
      align={{ base: 'flex-start', md: 'center' }}
    >
      <Heading fontSize="3xl">Users</Heading>
      <Button
        w={{ base: 'full', md: 'auto' }}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Add Users
      </Button>
    </Stack>
  );
}

export default UserActions;
