import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { UserContext } from 'contexts/user';
import useAuth from 'hooks/useAuth';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CellProps, Column } from 'react-table';
import { toast } from 'react-toastify';
import {
  useDisableUserMutation,
  useEnableUserMutation,
  useLazyGetUsersQuery,
} from 'store/reducers/users-api-slice';
import { TUser } from 'types/user';
import getServerErrorMessage from 'utilities/getServerErrorMessage';

type Props = {
  onOpen(): void;
};

function UsersList({ onOpen }: Props) {
  const [fetchUsers, { isFetching, data }] = useLazyGetUsersQuery();
  const { selectedUser, setSelectedUser } = useContext(UserContext);
  const [
    disableUser,
    {
      isError: isDisableError,
      isSuccess: isDisabled,
      isLoading: isDisabling,
      error: disableError,
      reset,
    },
  ] = useDisableUserMutation();

  const [
    enableUser,
    {
      isError: isEnableError,
      isSuccess: isEnabled,
      isLoading: isEnabling,
      error: enableError,
      reset: resetEnable,
    },
  ] = useEnableUserMutation();

  const { userDetails } = useAuth();

  const [disableEmail, setDisableEmail] = useState('');
  const [enableEmail, setEnableEmail] = useState('');

  const { isOpen, onClose, onOpen: onDialogOpen } = useDisclosure();
  const {
    isOpen: isEnableDialogOpen,
    onClose: onEnableDialogClose,
    onOpen: onEnableDialogOpen,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const enableCancelRef = useRef<HTMLButtonElement>(null);

  const columns: Column<TUser>[] = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Phone',
        accessor: 'phoneNumber',
        Cell: ({ value }) => <>{value ? value : 'NA'}</>,
      },
      {
        Header: 'Roles',
        accessor: 'roles',
        Cell: ({ value }) => (
          <>
            {value
              ? value.reduce(
                  (acc, cur) => `${acc + (acc ? ',' : '')} ${cur.name}`,
                  ''
                )
              : 'NA'}
          </>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row: { original } }: CellProps<TUser>) => {
          if (!userDetails) return null;
          if (userDetails.id === original.id) return null;
          const isActive = original.status === 'ACTIVE';
          return (
            <HStack>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedUser(original)}
              >
                Edit
              </Button>

              {isActive && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => setDisableEmail(original.email)}
                >
                  Disable
                </Button>
              )}

              {!isActive && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEnableEmail(original.email)}
                >
                  Enable
                </Button>
              )}
            </HStack>
          );
        },
      },
    ],
    [setSelectedUser, userDetails]
  );

  useEffect(() => {
    fetchUsers({});
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedUser) {
      onOpen();
    }
  }, [onOpen, selectedUser]);

  useEffect(() => {
    if (disableEmail) {
      onDialogOpen();
    }
  }, [disableEmail, onDialogOpen]);

  useEffect(() => {
    if (!isDisabling && isDisabled) {
      toast('User disabled', { type: 'success' });
      onClose();
    }
  }, [isDisabled, isDisabling, onClose]);

  useEffect(() => {
    if (isDisableError && !isDisabling && disableError) {
      toast(getServerErrorMessage(disableError), { type: 'error' });
    }
  }, [disableError, isDisableError, isDisabling]);

  useEffect(() => {
    if (enableEmail) {
      onEnableDialogOpen();
    }
  }, [enableEmail, onEnableDialogOpen]);

  useEffect(() => {
    if (!isEnabling && isEnabled) {
      toast('User enabled', { type: 'success' });
      onEnableDialogClose();
    }
  }, [isEnabled, isEnabling, onEnableDialogClose]);

  useEffect(() => {
    if (isEnableError && !isEnabling && enableError) {
      toast(getServerErrorMessage(enableError), { type: 'error' });
    }
  }, [enableError, isEnableError, isEnabling]);

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        leastDestructiveRef={cancelRef}
        onCloseComplete={() => {
          setDisableEmail('');
          reset();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Disable User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to disable this user?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onClose}
                variant="ghost"
                ref={cancelRef}
                isDisabled={isDisabling}
              >
                Cancel
              </Button>
              <Button
                onClick={() => disableUser(disableEmail)}
                ml={3}
                isDisabled={isDisabling}
                isLoading={isDisabling}
              >
                Disable
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isEnableDialogOpen}
        onClose={onEnableDialogClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        leastDestructiveRef={enableCancelRef}
        onCloseComplete={() => {
          setEnableEmail('');
          resetEnable();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Enable User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to enable this user?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onEnableDialogClose}
                variant="ghost"
                ref={enableCancelRef}
                isDisabled={isEnabling}
              >
                Cancel
              </Button>
              <Button
                onClick={() => enableUser(enableEmail)}
                ml={3}
                isDisabled={isEnabling}
                isLoading={isEnabling}
              >
                Enable
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
        <DataTable
          columns={columns}
          data={data ? data.data : []}
          fetchData={fetchUsers}
          loading={isFetching}
          totalPages={data ? data.pages : 0}
        />
      </Box>
    </>
  );
}

export default UsersList;
