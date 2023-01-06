import { Box } from '@chakra-ui/react';
import NonServerTable from 'components/DataTable/NonServerTable';
import { ElectionTypesContext } from 'contexts/election-types';
import { useContext, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { useLazyGetElectionTypesQuery } from 'store/reducers/election-type-api-slice';
import { TElectionType } from 'types/election-type';

type Props = {
  onOpen(): void;
};

function ElectionTypesList({ onOpen }: Props) {
  const [getElectionTypes, { data, isError, isFetching }] =
    useLazyGetElectionTypesQuery();
  const { setSelectedElectionType, selectedElectionType } =
    useContext(ElectionTypesContext);

  const columns = useMemo<Column<TElectionType>[]>(
    () => [
      { Header: 'Election Type', accessor: 'type' },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (
          <>{`${value.substring(0, 32)}${value.length > 32 ? '...' : ''}`}</>
        ),
      },
      { Header: 'Added By', accessor: 'addedBy' },
    ],
    []
  );

  useEffect(() => {
    getElectionTypes();
  }, [getElectionTypes]);

  useEffect(() => {
    if (selectedElectionType) {
      onOpen();
    }
  }, [onOpen, selectedElectionType]);

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
      <NonServerTable
        columns={columns}
        data={data ? data : []}
        loading={isFetching}
        handleRowClick={(data) => {
          setSelectedElectionType(data);
        }}
      />
    </Box>
  );
}

export default ElectionTypesList;
