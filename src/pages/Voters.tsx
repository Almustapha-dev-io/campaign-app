import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import EditVoter from 'components/voters/EditVoter';
import FileUpload from 'components/voters/FileUpload';
import ViewVoter from 'components/voters/ViewVoter';
import VotersList from 'components/voters/VotersList';
import VoterContextProvider from 'contexts/voter';
import useAuth from 'hooks/useAuth';
import useRoles from 'hooks/useRoles';
import { useCallback, useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { useLazyGetVotersQuery } from 'store/reducers/voters-api-slice';
import { TPagination } from 'types/paginaiton';
import { Roles } from 'types/roles';

function Voters() {
  useRoles(new Set([Roles.SuperAdmin, Roles.CallCenterAgent]));
  const { userDetails } = useAuth();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');

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

  const [getVoters, { isFetching, currentData: data }] =
    useLazyGetVotersQuery();

  const fetchVoters = useCallback(
    (data: TPagination) => {
      getVoters({ wardId: ward, ...data });
    },
    [getVoters, ward]
  );

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
    <VoterContextProvider>
      <ViewVoter />
      <EditVoter />
      {!!lgas && <FileUpload isOpen={isOpen} onClose={onClose} lgas={lgas} />}
      <VStack w="full" py={{ base: 4, lg: 12 }} spacing="16" align="flex-start">
        <Stack
          w="full"
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'flex-start', md: 'space-between' }}
          align={{ base: 'flex-start', md: 'center' }}
        >
          <Heading fontSize="3xl">Voters</Heading>
          {isAdmin && (
            <Button
              w={{ base: 'full', md: 'auto' }}
              leftIcon={<FiUpload />}
              onClick={onOpen}
              isDisabled={isFetchingLgs || isFetchingWards}
            >
              Upload Voters
            </Button>
          )}
        </Stack>

        {isAdmin && (
          <Stack w="full" spacing="6" direction={{ base: 'column', md: 'row' }}>
            <FormControl
              w={{ base: 'full', md: '300px' }}
              isDisabled={isFetching || isFetchingLgs}
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
              isDisabled={
                isFetching || isFetchingLgs || isFetchingWards || !lga
              }
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
          </Stack>
        )}

        {!!ward && !!userDetails && (
          <VotersList
            data={data ? data.data : []}
            fetchData={fetchVoters}
            isLoading={isFetching}
            totalPages={data ? data.pages : 0}
            user={userDetails}
          />
        )}
      </VStack>
    </VoterContextProvider>
  );
}

export default Voters;
