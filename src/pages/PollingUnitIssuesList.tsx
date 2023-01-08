import { FormControl, FormLabel, Select, Stack } from '@chakra-ui/react';
import PolllingUnitIssuesTable from 'components/polling-units/PollingUnitIssuesTable';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useLazyGetPollingUnitsQuery } from 'store/reducers/polling-units-api-slice';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { Roles } from 'types/roles';

function PollingUnitIssuesList() {
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');
  const [pollingUnit, setPollingUnit] = useState('');

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

  const { userDetails } = useAuth();
  const isAdmin = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin)
    : false;

  const isObserver = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.ObservationRoomAgent)
    : false;

  useEffect(() => {
    if (userDetails && userDetails.pollingUnit) {
      setPollingUnit(userDetails.pollingUnit.id.toString());
    }
  }, [userDetails]);

  useEffect(() => {
    if (isAdmin || isObserver) {
      getLgas();
    }
  }, [getLgas, isAdmin, isObserver]);

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

  return (
    <>
      {(isAdmin || isObserver) && (
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

      {!!pollingUnit && <PolllingUnitIssuesTable pollingUnitId={pollingUnit} />}
    </>
  );
}

export default PollingUnitIssuesList;
