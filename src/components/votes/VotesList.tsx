import {
  FormControl,
  FormLabel,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { Roles } from 'types/roles';

import VotesTable from './VotesTable';

function VotesList() {
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');

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

  const isAdmin = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin)
    : false;

  useEffect(() => {
    if (userDetails && userDetails.ward) {
      setWard(userDetails.ward.id.toString());
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
            <Select>
              <option>Select One</option>
            </Select>
          </FormControl>
        </Stack>
      )}

      {!!ward && (
        <Tabs w="full" isLazy>
          <TabList>
            <Tab>Registered</Tab>
            <Tab>Accredited</Tab>
            <Tab>Recorded</Tab>
            <Tab>Invalid</Tab>
          </TabList>
          <TabPanels pt="10">
            <TabPanel>
              <VotesTable wardId={ward} />
            </TabPanel>
            <TabPanel>
              <VotesTable wardId={ward} />
            </TabPanel>
            <TabPanel>
              <VotesTable wardId={ward} />
            </TabPanel>
            <TabPanel>
              <VotesTable wardId={ward} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
}

export default VotesList;