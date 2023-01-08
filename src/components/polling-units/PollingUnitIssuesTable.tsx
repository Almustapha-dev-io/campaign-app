import { Box, Link } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { VoteContext } from 'contexts/vote';
import { format } from 'date-fns';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { useLazyGetIssuesQuery } from 'store/reducers/polling-units-api-slice';
import { useLazyGetVotesQuery } from 'store/reducers/votes-api-slice';
import { TPagination } from 'types/paginaiton';
import { TPollingUnitIssue } from 'types/polling-unit';
import { TVote } from 'types/vote';

type Props = {
  pollingUnitId: string;
};

function PolllingUnitIssuesTable({ pollingUnitId }: Props) {
  const [getIssues, { isError, isFetching, currentData: data }] =
    useLazyGetIssuesQuery();

  const { setSelectedVote, selectedVote, onOpen } = useContext(VoteContext);

  const fetchVotes = useCallback(
    (data: TPagination) => {
      getIssues({ pollingUnitId: pollingUnitId, ...data });
    },
    [getIssues, pollingUnitId]
  );

  const columns = useMemo<Column<TPollingUnitIssue>[]>(
    () => [
      {
        Header: 'Polling Unit',
        accessor: 'pollingUnit',
        Cell: ({ value }) => <>{value.name}</>,
      },
      {
        Header: 'Issue',
        accessor: 'issue',
      },
      {
        Header: 'Media URL',
        accessor: 'mediaUrl',
        Cell: ({ value }) => (
          <Link href={value} isExternal colorScheme="blue">
            View Media
          </Link>
        ),
      },
      {
        Header: 'Added By',
        accessor: 'madeBy',
      },
      {
        Header: 'Date Added',
        accessor: 'dateMade',
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

export default PolllingUnitIssuesTable;
