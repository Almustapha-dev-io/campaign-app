import { useEffect, useRef } from 'react';
import {
  chakra,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  useColorModeValue,
  useDisclosure,
  HStack,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { RepeatIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useTable, Column, usePagination, useSortBy } from 'react-table';

import Loader from './Loader';
import Paginator from './Paginator';
import NoData from './NoData';
import { TPagination } from 'types/paginaiton';
import ExcelExport from './ExcelExport';
import { flattenObject } from 'utilities/flattenObject';

type Props = {
  columns: Column<any>[];
  data: any[];
  refresh?: number;
  totalPages: number;
  selectable?: boolean;
  handleRowClick?(row: any): any;
  loading: boolean;
  fetchData(data?: TPagination): any;
};

function DataTable({
  columns,
  data,
  totalPages,
  selectable,
  handleRowClick,
  fetchData,
  loading,
  refresh,
}: Props) {
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
      initialState: { pageIndex: 0 },
      manualPagination: true,
      manualSortBy: true,
      pageCount: totalPages,
    },
    useSortBy,
    usePagination
  );

  const allowFetch = useRef(false);

  const rowBG = useColorModeValue('gray.50', 'gray.800');
  const rowActiveBG = useColorModeValue('gray.100', 'gray.900');

  useEffect(() => {
    if (!loading && allowFetch.current) {
      fetchData({ page: pageIndex, size: pageSize });
    }

    return () => {
      allowFetch.current = true;
    };
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (refresh) {
      fetchData({ page: pageIndex, size: pageSize });
    }
  }, [refresh]);

  useEffect(() => {
    if (pageIndex === 0) {
      fetchData({ page: pageIndex, size: pageSize });
    } else {
      gotoPage(0);
    }
  }, [fetchData]);

  const {
    isOpen: exportExcel,
    onOpen: onExportExcel,
    onClose: onExportExcelClose,
  } = useDisclosure();

  let content = <Loader />;

  if (!loading) {
    content = (
      <>
        <ExcelExport
          isOpen={exportExcel}
          apiData={data.map((d) => flattenObject(d))}
          onClose={onExportExcelClose}
        />
        <HStack w="full" justify="flex-end" pb="8">
          <IconButton
            aria-label="Refresh list"
            variant="ghost"
            onClick={() => fetchData({ page: pageIndex, size: pageSize })}
            icon={<RepeatIcon />}
          />
          <Button variant="outline" onClick={onExportExcel}>
            Export Excel
          </Button>
        </HStack>

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

  if (!loading && data.length <= 0) {
    content = (
      <NoData onRetry={() => fetchData({ page: pageIndex, size: pageSize })} />
    );
  }

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

export default DataTable;
