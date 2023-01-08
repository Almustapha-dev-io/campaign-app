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
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import useRoles from 'hooks/useRoles';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useLazyGetPollingUnitsQuery,
  useUpdateUnitMutation,
} from 'store/reducers/polling-units-api-slice';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { TPollingUnit } from 'types/polling-unit';
import { Roles } from 'types/roles';
import getServerErrorMessage from 'utilities/getServerErrorMessage';

function PollingUnitData() {
  useRoles(new Set([Roles.SuperAdmin, Roles.PartyAgent]));
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');
  const [pollingUnit, setPollingUnit] = useState('');
  const [accreditedVoters, setAccreditedVoters] = useState(0);
  const [registeredVoter, setRegisteredVoter] = useState(0);

  const [
    getLgas,
    {
      isFetching: isFetchingLgs,
      data: lgas,
      isError: isLgaError,
      error: lgaError,
    },
  ] = useLazyGetLGAsQuery();
  const [
    getWards,
    {
      isFetching: isFetchingWards,
      data: wards,
      isError: isWardError,
      error: wardError,
    },
  ] = useLazyGetWardsQuery();

  const [
    getPollingUnits,
    {
      isFetching: isFetchingPUs,
      data: pollingUnits,
      isError: isPollingUnitError,
    },
  ] = useLazyGetPollingUnitsQuery();

  const [updateUnit, { isError, isSuccess, isLoading, error }] =
    useUpdateUnitMutation();

  const submitHandler = () => {
    if (accreditedVoters < 0 || registeredVoter < 0) {
      toast('Enter valid numbers greater than 0', { type: 'error' });
      return;
    }

    let pu: TPollingUnit | undefined;
    if (isAdmin) {
      if (!pollingUnits) return;
      pu = pollingUnits.find((p) => p.id.toString() === pollingUnit);
    } else {
      if (!userDetails) return;
      pu = userDetails.pollingUnit;
    }

    if (!pu) return;

    updateUnit({
      accreditedVoters,
      invalidVoters: pu.invalidVoters,
      name: pu.name,
      recordedVoters: pu.recordedVoters,
      wardId: pu.ward.id,
      id: pu.id,
      registeredVoters: registeredVoter,
    });
  };

  const { userDetails } = useAuth();
  const isAdmin = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin)
    : false;

  useEffect(() => {
    if (userDetails && userDetails.pollingUnit) {
      setPollingUnit(userDetails.pollingUnit.id.toString());
      setAccreditedVoters(userDetails.pollingUnit.accreditedVoters);
      setRegisteredVoter(userDetails.pollingUnit.registeredVoters);
    }
  }, [userDetails]);

  useEffect(() => {
    if (isAdmin) {
      getLgas();
    }
  }, [getLgas, isAdmin]);

  useEffect(() => {
    if (lga) {
      setWard('');
      getWards(lga);
    }
  }, [getWards, lga]);

  useEffect(() => {
    if (ward) {
      setPollingUnit('');
      getPollingUnits(Number(ward));
    }
  }, [getPollingUnits, ward]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      toast(`Polling Unit details successfully updated`, {
        type: 'success',
      });
    }
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (isError && !isLoading && error) {
      toast(getServerErrorMessage(error), { type: 'error' });
    }
  }, [isError, isLoading, error]);

  if (!userDetails) {
    return null;
  }

  if (
    !userDetails.pollingUnit &&
    !userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin)
  ) {
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

      {isAdmin && (
        <Stack w="full" spacing="6" direction={{ base: 'column', md: 'row' }}>
          <FormControl
            w={{ base: 'full', md: '200px' }}
            isDisabled={isFetchingLgs}
          >
            <FormLabel>Local Gov't</FormLabel>
            <Select
              defaultValue=""
              value={lga}
              onChange={(e) => setLga(e.target.value)}
            >
              <option value="" hidden>
                Select Local Gov't
              </option>
              {!!lgas
                ? lgas.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))
                : null}
            </Select>
          </FormControl>

          <FormControl
            w={{ base: 'full', md: '200px' }}
            isDisabled={isFetchingLgs || isFetchingWards || !lga}
          >
            <FormLabel>Ward</FormLabel>
            <Select
              defaultValue=""
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="" hidden>
                Select Ward
              </option>
              {!!wards
                ? wards.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))
                : null}
            </Select>
          </FormControl>

          <FormControl
            w={{ base: 'full', md: '200px' }}
            isDisabled={isFetchingLgs || isFetchingWards || !lga || !ward}
          >
            <FormLabel>Polling Unit</FormLabel>
            <Select
              defaultValue=""
              value={pollingUnit}
              onChange={(e) => setPollingUnit(e.target.value)}
            >
              <option>Select One</option>
              {!!pollingUnits
                ? pollingUnits.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))
                : null}
            </Select>
          </FormControl>
        </Stack>
      )}

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
          <FormControl isReadOnly={isAdmin}>
            <FormLabel>Total Registered Voters</FormLabel>
            <NumberInput
              size="lg"
              value={registeredVoter}
              onChange={(v) => setRegisteredVoter(Number(v))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isReadOnly={isAdmin}>
            <FormLabel>Total Accredited Voters</FormLabel>
            <NumberInput
              size="lg"
              value={accreditedVoters}
              onChange={(v) => setAccreditedVoters(Number(v))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {!isAdmin && (
            <HStack w="full" justify="flex-end" pt="5">
              <Button
                size="lg"
                w={{ base: 'full', md: '150px' }}
                isLoading={isLoading}
                onClick={submitHandler}
              >
                Save
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}

export default PollingUnitData;
