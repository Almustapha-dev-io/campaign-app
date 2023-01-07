import { DeleteIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import useRoles from 'hooks/useRoles';
import React, { useEffect, useState } from 'react';
import { Roles } from 'types/roles';

function PollingUnitIssues() {
  useRoles(new Set([Roles.SuperAdmin, Roles.PartyAgent]));
  const { userDetails } = useAuth();
  const [mediaCategory, setMediaCategory] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const isValid = () => {
    if (!mediaCategory) return false;
    if (mediaCategory === 'Others' && !otherValue) return false;
    if (!file) return false;
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (files.length < 1) return;
    const selectedFile = files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    setOtherValue('');
  }, [mediaCategory]);

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
        <Heading fontSize="3xl">Polling Unit Issues</Heading>
      </Stack>

      <Box
        w="full"
        py="8"
        px={{ base: 4, md: 6 }}
        shadow="sm"
        bg="white"
        rounded="md"
      >
        <Text>Report Issues At Polling Unit</Text>

        <VStack w={{ base: 'full', md: '500px' }} mt="12" spacing="6">
          <FormControl>
            <FormLabel>Issue Category</FormLabel>
            <Select
              defaultValue=""
              value={mediaCategory}
              onChange={(e) => setMediaCategory(e.target.value)}
            >
              <option value="">Select one</option>
              <option value="Ballot Snatching">Ballot Snatching</option>
              <option value="Ballot Stuffing">Ballot Stuffing</option>
              <option value="Bribery">Bribery</option>
              <option value="Campaigning In Voting Areas">
                Campaigning In Voting Areas
              </option>
              <option value="Disorderly Behaviour">Disorderly Behaviour</option>
              <option value="Impersonation">Impersonation</option>
              <option value="Improper Behaviour By INEC">
                Improper Behaviour By INEC
              </option>
              <option value="Improper Behaviour By Security">
                Improper Behaviour By Security
              </option>
              <option value="Late Arrival Of Materials">
                Late Arrival Of Materials
              </option>
              <option value="Threatning Of Agents">Threatning Of Agents</option>
              <option value="Underage Voting">Underage Voting</option>
              <option value="Undue Influence">Undue Influence</option>
              <option value="Vote Buying">Vote Buying</option>
              <option value="Voter Intimidation">Voter Intimidation</option>
              <option value="Voting By Unregistered Persons">
                Voting By Unregistered Persons
              </option>
              <option value="Others">Others</option>
            </Select>
          </FormControl>

          {mediaCategory === 'Others' && (
            <FormControl>
              <FormLabel>If category is others, enter category here</FormLabel>
              <Input
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Select File</FormLabel>
            <input type="file" onChange={handleFileChange} />
          </FormControl>

          {!!file && (
            <>
              <Divider />
              <HStack w="full" justify="center">
                <Text>{file.name}</Text>
                <IconButton
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  aria-label="Remove file"
                  icon={<DeleteIcon />}
                  //   isDisabled={status === 'pending'}
                  //   isLoading={status === 'pending'}
                  onClick={() => setFile(() => null)}
                />
              </HStack>
            </>
          )}

          <HStack w="full" justify="flex-end" pt="5">
            <Button
              size="lg"
              w={{ base: 'full', md: '150px' }}
              isDisabled={!isValid()}
            >
              Save
            </Button>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}

export default PollingUnitIssues;
