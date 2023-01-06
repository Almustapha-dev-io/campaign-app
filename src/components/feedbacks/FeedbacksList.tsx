import {
  FormControl,
  FormLabel,
  HStack,
  Select,
  Stack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { FeedbackChannels } from 'types/feedback';
import { Roles } from 'types/roles';

import FeedbackTable from './FeedbackTable';

function FeedbacksList() {
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');
  const [channel, setChannel] = useState('');

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
      <Stack
        w="full"
        direction={{ base: 'column', md: 'row' }}
        spacing="4"
        justify="flex-start"
      >
        {isAdmin && (
          <>
            <FormControl
              w={{ base: 'full', md: '300px' }}
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
              w={{ base: 'full', md: '300px' }}
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
          </>
        )}

        <FormControl w="300px" maxW="full">
          <FormLabel>Channel</FormLabel>
          <Select
            defaultValue={undefined}
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">All</option>
            {Object.values(FeedbackChannels).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {!!ward && <FeedbackTable wardId={ward} channel={channel} />}
    </>
  );
}

export default FeedbacksList;
