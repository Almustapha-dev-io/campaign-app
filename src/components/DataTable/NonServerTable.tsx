import React, { useCallback } from 'react';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import {
  chakra,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';

import Loader from './Loader';
import Paginator from './Paginator';
import NoData from './NoData';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

type Props = {
  columns: Column<any>[];
  data: any[];
  onRefresh?: () => any;
  withExport?: boolean;
  withSearch?: boolean;
  selectable?: boolean;
  handleRowClick?(row: any): any;
  loading: boolean;
};

function NonServerTable({
  columns,
  data,
  loading,
  handleRowClick,
  selectable,
  withExport,
  withSearch,
  onRefresh,
}: Props) {
  const rowBG = useColorModeValue('gray.50', 'gray.800');
  const rowActiveBG = useColorModeValue('gray.100', 'gray.900');

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  //   const refresher = useCallback(() => {
  //     if (!onRefresh) return;
  //     gotoPage(0);
  //     onRefresh();
  //   }, [onRefresh]);

  let content = <Loader />;

  if (!loading) {
    content = (
      <>
        <TableContainer w="full">
          <Table {...getTableProps()}>
            <Thead>
              {headerGroups.map((hg) => (
                <Tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((col) => (
                    <Th
                      {...col.getHeaderProps(col.getSortByToggleProps())}
                      p={2}
                    >
                      {col.render('Header')}
                      <chakra.span pl={4}>
                        {col.isSorted ? (
                          col.isSortedDesc ? (
                            <TriangleDownIcon
                              aria-label="sorted desc"
                              h={3}
                              w={3}
                            />
                          ) : (
                            <TriangleUpIcon
                              aria-label="sorted asc"
                              h={3}
                              w={3}
                            />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((r) => {
                prepareRow(r);
                return (
                  <Tr
                    {...r.getRowProps()}
                    _active={{
                      backgroundColor: selectable ? rowActiveBG : '',
                    }}
                    _hover={{
                      backgroundColor: selectable ? rowBG : '',
                      cursor: 'pointer',
                    }}
                    onClick={
                      handleRowClick
                        ? () => handleRowClick(r.original)
                        : () => {}
                    }
                  >
                    {r.cells.map((cell) => (
                      <Td
                        {...cell.getCellProps()}
                        fontSize="sm"
                        fontWeight="light"
                        p={2}
                      >
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  }

  //   if (!loading && data.length <= 0) {
  //     content = <NoData onRetry={onRefresh ? refresher : undefined} />;
  //   }

  return (
    <>
      <>{content}</>
      {data.length > 0 && !loading && (
        <Paginator
          canNextPage={canNextPage}
          canPreviousPage={canPreviousPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          pageSize={pageSize}
          previousPage={previousPage}
          setPageSize={setPageSize}
        />
      )}
    </>
  );
}

export default NonServerTable;
