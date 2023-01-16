import { Box } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { VoteContext } from 'contexts/vote';
import { format } from 'date-fns';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { useLazyGetVotesQuery } from 'store/reducers/votes-api-slice';
import { TPagination } from 'types/paginaiton';
import { TVote } from 'types/vote';

type Props = {
  pollingUnitId: string;
};

function VotesTable({ pollingUnitId }: Props) {
  const [getVotes, { isError, isFetching, currentData: data }] =
    useLazyGetVotesQuery();

  const { setSelectedVote, selectedVote, onOpen } = useContext(VoteContext);

  const fetchVotes = useCallback(
    (data: TPagination) => {
      getVotes({ pollingUnitId: pollingUnitId, ...data });
    },
    [getVotes, pollingUnitId]
  );

  const columns = useMemo<Column<TVote>[]>(
    () => [
      {
        Header: 'Polling Unit',
        accessor: 'pollingUnit',
        Cell: ({ value }) => <>{value.name}</>,
      },
      {
        Header: 'Party',
        accessor: 'party',
        Cell: ({ value }) => (
          <>
            {value.name} - {value.id}
          </>
        ),
      },
      {
        Header: 'Votes',
        accessor: 'numberOfVotes',
      },
      {
        Header: 'Added By',
        accessor: 'addedBy',
      },
      {
        Header: 'Date Added',
        accessor: 'dateAdded',
        Cell: ({ value }) => <>{format(new Date(value), 'MMM dd, yyyy')}</>,
      },
    ],
    []
  );

  useEffect(() => {
    if (selectedVote) {
      onOpen();
    }
  }, [onOpen, selectedVote]);

  useEffect(() => {
    fetchVotes({ page: 0, size: 10 });
  }, [fetchVotes]);

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
      <DataTable
        columns={columns}
        data={data ? data.data : []}
        fetchData={fetchVotes}
        loading={isFetching}
        totalPages={data ? data.pages : 0}
        handleRowClick={(data) => {
          setSelectedVote(data);
        }}
      />
    </Box>
  );
}

export default VotesTable;
