import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { TOfflineVote } from 'types/vote';
import { getOfflineUser } from 'utilities/offline-helpers';
import politicalParties from 'utilities/politcal-parties';

type Props = {
  onAddVotes(vote: TOfflineVote): void;
};

function AddOfflineVote({ onAddVotes }: Props) {
  const [party, setParty] = useState('');
  const [votes, setVotes] = useState(0);

  const onSubmit = () => {
    if (!party || isNaN(votes)) {
      return;
    }

    const user = getOfflineUser();
    if (!user) return;

    if (!user.user.pollingUnit) return;

    const vote: TOfflineVote = {
      party,
      votes,
      pollingUnit: user.user.pollingUnit,
    };
    onAddVotes(vote);
    setParty('');
    setVotes(0);
  };

  return (
    <VStack
      w="full"
      bg="white"
      shadow="sm"
      rounded="md"
      px={{ base: 4, md: 6 }}
      py="8"
      align="flex-start"
      spacing="6"
    >
      <Heading fontSize="xl" fontWeight="semibold">
        Add Vote
      </Heading>

      <VStack w={{ base: 'full', md: '400px' }} spacing="5">
        <FormControl>
          <FormLabel>Party</FormLabel>
          <Select
            defaultValue=""
            value={party}
            onChange={(e) => setParty(e.target.value)}
          >
            <option value="" selected hidden>
              Select Party
            </option>
            {politicalParties.map((p) => (
              <option value={p.value} key={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Total Votes</FormLabel>
          <NumberInput min={0} value={votes} onChange={(_, v) => setVotes(v)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <HStack w="full" justify="flex-end">
          <Button
            size="lg"
            w={{ base: 'full', md: 'auto' }}
            isDisabled={!party || isNaN(votes)}
            onClick={onSubmit}
          >
            Save
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}

export default AddOfflineVote;
