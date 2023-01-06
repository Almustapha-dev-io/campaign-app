import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import AddElectionType from 'components/election-types/AddElectionType';
import ElectionTypesList from 'components/election-types/ElectionTypesList';
import ElectionTypesContextProvider from 'contexts/election-types';

function ElectionTypes() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <ElectionTypesContextProvider>
      <AddElectionType isOpen={isOpen} onClose={onClose} />

      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="24">
        <Stack
          w="full"
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'flex-start', md: 'space-between' }}
          align={{ base: 'flex-start', md: 'center' }}
        >
          <Heading fontSize="3xl">Election Types</Heading>
          <Button
            w={{ base: 'full', md: 'auto' }}
            leftIcon={<AddIcon />}
            onClick={onOpen}
          >
            Add Election Type
          </Button>
        </Stack>
        <ElectionTypesList onOpen={onOpen} />
      </VStack>
    </ElectionTypesContextProvider>
  );
}

export default ElectionTypes;
