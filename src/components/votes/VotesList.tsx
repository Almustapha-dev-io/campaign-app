import {
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useLazyGetPollingUnitsQuery } from 'store/reducers/polling-units-api-slice';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { TPollingUnit } from 'types/polling-unit';
import { Roles } from 'types/roles';

import VotesTable from './VotesTable';

function VotesList() {
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');
  const [pollingUnit, setPollingUnit] = useState('');
  const [accreditedVoters, setAccreditedVoters] = useState(0);
  const [registeredVoters, setRegisteredVoters] = useState(0);
  const [recordedVoters, setRecordedVoters] = useState(0);
  const [invalidVoters, setInvalidVoters] = useState(0);
  const [unit, setUnit] = useState<TPollingUnit | null>(null);

  const { userDetails } = useAuth();

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

  const isAdmin = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin)
    : false;

  useEffect(() => {
    if (userDetails && userDetails.pollingUnit) {
      setPollingUnit(userDetails.pollingUnit.id.toString());
      getPollingUnits(userDetails.pollingUnit.ward.id);
    }
  }, [getPollingUnits, userDetails]);

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
    if (pollingUnits && pollingUnit) {
      const u = pollingUnits.find((p) => p.id.toString() === pollingUnit);
      if (u) {
        setUnit(u);
      }
    }
  }, [isAdmin, pollingUnit, pollingUnits, userDetails]);

  return (
    <>
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

      {!!pollingUnit && (
        <>
          <VStack w="full" align="flex-start" spacing="2">
            <Heading fontWeight="medium" fontSize="lg">
              Accredited Voters: {unit?.accreditedVoters}
            </Heading>
            <Heading fontWeight="medium" fontSize="lg">
              Registered Voters: {unit?.registeredVoters}
            </Heading>
            <Heading fontWeight="medium" fontSize="lg">
              Recorded Voters: {unit?.recordedVoters}
            </Heading>
            <Heading fontWeight="medium" fontSize="lg">
              Invalid Voters: {unit?.invalidVoters}
            </Heading>
          </VStack>
          <VotesTable pollingUnitId={pollingUnit} />
        </>
        // <Tabs w="full" isLazy>
        //   <TabList>
        //     <Tab>Registered</Tab>
        //     <Tab>Accredited</Tab>
        //     <Tab>Recorded</Tab>
        //     <Tab>Invalid</Tab>
        //   </TabList>
        //   <TabPanels pt="10">
        //     <TabPanel>
        //       <VotesTable pollingUnitId={pollingUnit} />
        //     </TabPanel>
        //     <TabPanel>
        //       <VotesTable pollingUnitId={pollingUnit} />
        //     </TabPanel>
        //     <TabPanel>
        //       <VotesTable pollingUnitId={pollingUnit} />
        //     </TabPanel>
        //     <TabPanel>
        //       <VotesTable pollingUnitId={pollingUnit} />
        //     </TabPanel>
        //   </TabPanels>
        // </Tabs>
      )}
    </>
  );
}

export default VotesList;
