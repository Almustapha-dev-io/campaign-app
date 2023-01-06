import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Tooltip,
  Select,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

type Props = {
  pageIndex: number;
  pageOptions: number[];
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  previousPage: () => void;
  nextPage: () => void;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  setPageSize: (pageSize: number) => void;
};

function Paginator({
  pageIndex,
  pageOptions,
  pageSize,
  pageCount,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
  setPageSize,
}: Props) {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      align={{ base: 'flex-start', md: 'center' }}
      mt={10}
      w="full"
    >
      <Flex alignItems="center">
        <Text fontSize="sm" fontWeight="light" flexShrink={0} mr={4}>
          Page{' '}
          <Text fontWeight="bold" as="span">
            {pageIndex + 1}{' '}
          </Text>
          of{' '}
          <Text fontWeight="bold" as="span">
            {pageOptions.length}
          </Text>
        </Text>
        <Text fontSize="sm" fontWeight="light" flexShrink={0}>
          Go to page
        </Text>{' '}
        <NumberInput
          ml={2}
          w={20}
          min={1}
          max={pageOptions.length}
          size="sm"
          onChange={(_, v) => {
            const p = v ? v - 1 : 0;
            gotoPage(p);
          }}
          defaultValue={pageIndex + 1}
        >
          <NumberInputField rounded="md" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

      <Flex mt={{ base: 6, lg: 0 }} mb={{ base: 4, lg: 0 }}>
        <Select
          w={28}
          value={pageSize}
          size="sm"
          rounded="md"
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[1, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
          <option value={pageSize * pageCount}>Show All</option>
        </Select>
      </Flex>

      <Flex>
        <Flex mr={4}>
          <Tooltip label="First Page">
            <IconButton
              variant="ghost"
              aria-label="To first page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip>

          <Tooltip label="Previous Page">
            <IconButton
              variant="ghost"
              aria-label="To previous page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              variant="ghost"
              aria-label="To next page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
              mr={4}
            />
          </Tooltip>

          <Tooltip label="Last Page">
            <IconButton
              variant="ghost"
              aria-label="To last page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Paginator;
