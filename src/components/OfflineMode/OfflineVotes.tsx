import { Box, Button, Divider, VStack } from '@chakra-ui/react';
import NonServerTable from 'components/DataTable/NonServerTable';
import useOnlineStatus from 'hooks/useOnlineStatus';
import { useMemo } from 'react';
import { CellProps, Column } from 'react-table';
import { TOfflineVote } from 'types/vote';

type Props = {
  votes: TOfflineVote[];
  onDelete(vote: TOfflineVote): void;
};

function OfflineVotes({ votes, onDelete }: Props) {
  const isOnline = useOnlineStatus();

  const columns = useMemo<Column<TOfflineVote>[]>(
    () => [
      {
        Header: 'Polling Unit',
        accessor: 'pollingUnit',
        Cell: ({ value }) => <>{value.name}</>,
      },
      {
        Header: 'Party',
        accessor: 'party',
      },
      {
        Header: 'Votes',
        accessor: 'votes',
      },
      {
        Header: 'Action',
        Cell: ({ row }: CellProps<TOfflineVote>) => (
          <>
            <Button
              variant="ghost"
              colorScheme="red"
              size="sm"
              onClick={() => onDelete(row.original)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    [onDelete]
  );

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" px="4" py="8">
      <VStack w="full" align="flex-end" spacing="10">
        {votes.length > 0 && (
          <>
            <Button
              size="lg"
              w={{ base: 'full', md: 'auto' }}
              isDisabled={!isOnline}
            >
              Sync Data
            </Button>
            <Divider />
          </>
        )}
        <NonServerTable columns={columns} data={votes} loading={false} />
      </VStack>
    </Box>
  );
}

export default OfflineVotes;
