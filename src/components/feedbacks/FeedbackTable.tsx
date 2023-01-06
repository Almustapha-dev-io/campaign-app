import { Box } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { FeedbackContext } from 'contexts/feedback';
import { format } from 'date-fns';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { useLazyGetFeedbacksQuery } from 'store/reducers/feedback-api-slice';
import { TFeedback } from 'types/feedback';
import { TPagination } from 'types/paginaiton';

type Props = {
  wardId: string;
  channel: string;
};

function FeedbackTable({ wardId, channel }: Props) {
  const [getFeedbacks, { isError, isFetching, currentData: data }] =
    useLazyGetFeedbacksQuery();

  const { setSelectedFeedback, selectedFeedback, onOpen } =
    useContext(FeedbackContext);

  const fetchFeedbacks = useCallback(
    (data: TPagination) => {
      getFeedbacks({ wardId: wardId, channel, ...data });
    },
    [channel, getFeedbacks, wardId]
  );

  const columns = useMemo<Column<TFeedback>[]>(
    () => [
      {
        Header: 'Comment',
        accessor: 'comment',
        Cell: ({ value }) => (
          <>{`${value.substring(0, 32)}${value.length > 32 ? '...' : ''} `}</>
        ),
      },
      {
        Header: 'Ward',
        accessor: 'ward',
        Cell: ({ value }) => <>{value.name}</>,
      },
      {
        Header: 'Channel',
        accessor: 'channel',
      },
      {
        Header: 'Added By',
        accessor: 'madeBy',
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
    if (selectedFeedback) {
      onOpen();
    }
  }, [onOpen, selectedFeedback]);

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
      <DataTable
        columns={columns}
        data={data ? data.data : []}
        fetchData={fetchFeedbacks}
        loading={isFetching}
        totalPages={data ? data.pages : 0}
        handleRowClick={(data) => {
          setSelectedFeedback(data);
        }}
      />
    </Box>
  );
}

export default FeedbackTable;
