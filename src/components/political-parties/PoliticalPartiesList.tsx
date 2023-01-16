import { Box } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { PoliticalPartyContext } from 'contexts/political-parties';

import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { useLazyGetPoliticalPartyQuery } from 'store/reducers/political-party-api-slice';
import { TPagination } from 'types/paginaiton';
import { TPoliticalParty } from 'types/political-party';

type Props = {
  onOpen(): void;
};

function PoliticalPartiesList({ onOpen }: Props) {
  const [getParties, { data, isError, isFetching }] =
    useLazyGetPoliticalPartyQuery();

  const { selectPoliticalParty, setSelectedPoliticalParty } = useContext(
    PoliticalPartyContext
  );

  const columns = useMemo<Column<TPoliticalParty>[]>(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Party Code', accessor: 'id' },
    ],
    []
  );

  const fetchParties = useCallback(
    (data: TPagination) => {
      getParties(data);
    },
    [getParties]
  );

  useEffect(() => {
    fetchParties({});
  }, [fetchParties]);

  useEffect(() => {
    if (selectPoliticalParty) {
      onOpen();
    }
  }, [onOpen, selectPoliticalParty]);

  return (
    <Box w="full" bg="white" rounded="lg" shadow="sm" p="4">
      <DataTable
        columns={columns}
        data={data ? data.data : []}
        fetchData={fetchParties}
        loading={isFetching}
        totalPages={data ? data.pages : 0}
        handleRowClick={(data) => setSelectedPoliticalParty(data)}
      />
    </Box>
  );
}

export default PoliticalPartiesList;
