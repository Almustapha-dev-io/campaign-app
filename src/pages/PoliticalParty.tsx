import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import AddPoliticalParty from 'components/political-parties/AddPoliticalParty';
import PoliticalPartiesList from 'components/political-parties/PoliticalPartiesList';
import PoliticalPartyContextProvider from 'contexts/political-parties';

function PoliticalParty() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <PoliticalPartyContextProvider>
      <AddPoliticalParty isOpen={isOpen} onClose={onClose} />

      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="24">
        <Stack
          w="full"
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'flex-start', md: 'space-between' }}
          align={{ base: 'flex-start', md: 'center' }}
        >
          <Heading fontSize="3xl">Political Parties</Heading>
          <Button
            w={{ base: 'full', md: 'auto' }}
            leftIcon={<AddIcon />}
            onClick={onOpen}
          >
            Add Party
          </Button>
        </Stack>

        <PoliticalPartiesList onOpen={onOpen} />
      </VStack>
    </PoliticalPartyContextProvider>
  );
}

export default PoliticalParty;
