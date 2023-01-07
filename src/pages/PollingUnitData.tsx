import { WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import useRoles from 'hooks/useRoles';
import { Roles } from 'types/roles';

function PollingUnitData() {
  useRoles(new Set([Roles.SuperAdmin, Roles.PartyAgent]));
  const { userDetails } = useAuth();

  if (!userDetails) {
    return null;
  }

  if (!userDetails.pollingUnit) {
    return (
      <Center w="full" h="500px">
        <VStack w="full" spacing="4">
          <WarningIcon color="red.500" fontSize="6xl" />
          <Text textAlign="center" fontWeight="bold">
            All Party Agents Must be assigned to a Polling Unit. <br />
            Contact Admin
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack w="full" py={{ base: 4, lg: 12 }} spacing="14" align="flex-start">
      <Stack
        w="full"
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'flex-start', md: 'space-between' }}
        align={{ base: 'flex-start', md: 'center' }}
      >
        <Heading fontSize="3xl">Polling Unit Data</Heading>
      </Stack>

      <Box
        w="full"
        py="8"
        px={{ base: 4, md: 6 }}
        shadow="sm"
        bg="white"
        rounded="md"
      >
        <Text>Enter Polling Unit Voters Details</Text>

        <VStack w={{ base: 'full', md: '500px' }} mt="12" spacing="6">
          <FormControl>
            <FormLabel>Total Registered Voters</FormLabel>
            <NumberInput size="lg">
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Total Accredited Voters</FormLabel>
            <NumberInput size="lg">
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <HStack w="full" justify="flex-end" pt="5">
            <Button size="lg" w={{ base: 'full', md: '150px' }}>
              Save
            </Button>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}

export default PollingUnitData;
