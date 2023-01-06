import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import arrayToExcel from 'utilities/array-to-excel';
import NoData from './NoData';

type Props = {
  isOpen: boolean;
  onClose(): void;
  apiData: any[];
};

const ExcelExport: React.FC<Props> = ({ apiData, isOpen, onClose }) => {
  const [exportType, setExportType] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const onColumnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    e.preventDefault();
    if (selectedColumns.includes(key)) {
      setSelectedColumns((cols) => cols.filter((colVal) => colVal !== key));
    } else {
      setSelectedColumns((cols) => [...cols, key]);
    }
  };

  const toExcel = async () => {
    try {
      const { convertArrayToTable } = arrayToExcel;
      if (exportType === 'ALL') {
        await convertArrayToTable(apiData, Date.now().toString());
      } else {
        const data = apiData.map((d) => {
          return selectedColumns.reduce((acc: any, cur) => {
            acc[cur] = d[cur];
            return acc;
          }, {});
        });
        await convertArrayToTable(data, Date.now().toString());
      }
    } catch (error) {
      console.log('Error', error);
      toast('Export to excel failed.', { type: 'error' });
    }
  };

  let content = (
    <Box w="full">
      <NoData />
    </Box>
  );

  if (apiData.length > 0) {
    content = (
      <VStack w="full" spacing={4}>
        <FormControl>
          <FormLabel>Select Export Type</FormLabel>
          <Select
            onChange={(e) =>
              setExportType((_) => e.target.value as 'ALL' | 'CUSTOM')
            }
          >
            <option value="ALL">All Columns</option>
            <option value="CUSTOM">Custom</option>
          </Select>
        </FormControl>
        <Divider />
        {exportType === 'ALL' && (
          <Box
            w="full"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            p={2}
          >
            {Object.keys(apiData[0]).map((key, i) => (
              <Badge
                mr="2"
                mb="2"
                key={i}
                px={2}
                py={1}
                fontWeight="medium"
                rounded="full"
              >
                {key}
              </Badge>
            ))}
          </Box>
        )}

        {exportType === 'CUSTOM' && (
          <SimpleGrid w="full" columns={2} spacing={4}>
            {Object.keys(apiData[0]).map((key, i) => (
              <GridItem key={i}>
                <Checkbox
                  id={key}
                  isChecked={selectedColumns.includes(key)}
                  onChange={(e) => onColumnChange(e, key)}
                >
                  <Heading
                    fontSize="sm"
                    fontWeight="medium"
                    wordBreak="break-word"
                  >
                    {key}
                  </Heading>
                </Checkbox>
              </GridItem>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    );
  }

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={() => {
        setExportType((_) => 'ALL');
        setSelectedColumns((_) => []);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Export to Excel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={toExcel}>
            Download
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExcelExport;
