import { Box, Button, ButtonGroup, HStack } from '@chakra-ui/react';
import NonServerTable from 'components/DataTable/NonServerTable';
import { useEffect, useMemo } from 'react';
import { Column, CellProps } from 'react-table';
import { useLazyGetRolesQuery } from 'store/reducers/roles-api-slices';
import { TRole } from 'types/roles';

function RolesList() {
  const [getRoles, { data, isError, isFetching }] = useLazyGetRolesQuery();

  const columns: Column<TRole>[] = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
    ],
    []
  );

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
      <NonServerTable
        columns={columns}
        data={data ? data : []}
        loading={isFetching}
      />
    </Box>
  );
}

export default RolesList;
