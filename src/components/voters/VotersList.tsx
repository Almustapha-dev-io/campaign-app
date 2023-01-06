import { Box, Button, HStack } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { VoterContext } from 'contexts/voter';
import { format } from 'date-fns';
import { useContext, useEffect, useMemo } from 'react';
import { CellProps, Column } from 'react-table';
import { TPagination } from 'types/paginaiton';
import { Roles } from 'types/roles';
import { TUser } from 'types/user';
import { TVoter } from 'types/voter';
import hasRoles from 'utilities/hasRole';

type Props = {
  data: TVoter[];
  fetchData(data: TPagination): void;
  isLoading: boolean;
  totalPages: number;
  user: TUser;
};

function VotersList({ data, fetchData, isLoading, totalPages, user }: Props) {
  const {
    onViewOpen,
    selectedVoterToView,
    setSelectedVoter,
    onEditOpen,
    selectedVoterToEdit,
  } = useContext(VoterContext);

  const columns = useMemo<Column<TVoter>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => <>{value ?? 'N/A'}</>,
      },
      {
        Header: 'Phone',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Date Added',
        accessor: 'dateAdded',
        Cell: ({ value }) => <>{format(new Date(value), 'MMM dd, yyyy')}</>,
      },
      {
        Header: 'Actions',
        Cell: (props: CellProps<TVoter>) => {
          const voter = props.row.original;

          return (
            <HStack>
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={() => setSelectedVoter({ voter })}
              >
                View
              </Button>
              {hasRoles(user, new Set([Roles.CallCenterAgent])) &&
                voter.status === 'PENDING' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedVoter({ voter, isEdit: true })}
                  >
                    Add Response
                  </Button>
                )}
            </HStack>
          );
        },
      },
    ],
    [setSelectedVoter, user]
  );

  useEffect(() => {
    if (selectedVoterToView) {
      onViewOpen();
    }
  }, [onViewOpen, selectedVoterToView]);

  useEffect(() => {
    if (selectedVoterToEdit) {
      onEditOpen();
    }
  }, [onEditOpen, selectedVoterToEdit]);

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
      <DataTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={isLoading}
        totalPages={totalPages}
      />
    </Box>
  );
}

export default VotersList;
