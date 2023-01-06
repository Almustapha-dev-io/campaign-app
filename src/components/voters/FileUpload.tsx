import { DeleteIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Select,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { uploadVoters } from 'api/voters';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BsFillCloudUploadFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { reset, startTask } from 'store/reducers/auth-slice';
import { useGetElectionTypesQuery } from 'store/reducers/election-type-api-slice';
import { useLazyGetWardsQuery } from 'store/reducers/states-api-slice';
import { TLocalGovernment } from 'types/ward';

type Props = Omit<ModalProps, 'children'> & {
  lgas: TLocalGovernment[];
};

function FileUpload({ isOpen, onClose, lgas }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ward, setWard] = useState('');
  const [lga, setLga] = useState('');
  const [electionType, setElectionType] = useState('');

  const { data, isFetching, isError, refetch } = useGetElectionTypesQuery();
  const [
    getWards,
    {
      isFetching: isFetchingWards,
      data: wards,
      isError: isWardError,
      error: wardError,
    },
  ] = useLazyGetWardsQuery();

  const dispatch = useAppDispatch();
  const { status, uploadSuccess } = useAppSelector((s) => s.auth);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast('Select a file', { type: 'warning' });
      return;
    }
    const files = Array.from(e.target.files);
    if (!files.length) {
      toast('Select a file', { type: 'warning' });
      return;
    }

    setSelectedFile(files[0]);
  };

  const refHandler = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const submitHandler = () => {
    if (status === 'pending' || !selectedFile || !ward) return;

    dispatch(startTask());
    dispatch(
      uploadVoters({
        file: selectedFile,
        wardId: ward,
        electionTypeId: electionType,
      })
    );
  };

  useEffect(() => {
    if (isOpen && uploadSuccess) {
      onClose();
    }
  }, [uploadSuccess, isOpen, onClose]);

  useEffect(() => {
    if (lga) {
      setWard('');
      getWards(lga);
    }
  }, [getWards, lga]);

  let content = (
    <VStack w="full" spacing="4">
      <Icon color="blue.100" fontSize="6xl" as={BsFillCloudUploadFill} />
      <FormControl>
        <FormLabel>Select Local Gov't</FormLabel>
        <Select
          defaultValue=""
          value={lga}
          onChange={(e) => setLga(e.target.value)}
        >
          <option value="" hidden>
            Select Local Gov't
          </option>
          {lgas.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Select Ward</FormLabel>
        <Select
          defaultValue=""
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        >
          <option value="" hidden>
            Select Ward
          </option>
          {!!wards &&
            wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Select Election Type</FormLabel>
        <Select
          defaultValue=""
          value={electionType}
          onChange={(e) => setElectionType(e.target.value)}
        >
          <option value="" hidden>
            Select Election Type
          </option>
          {!!data &&
            data.map((d) => (
              <option value={d.id} key={d.id}>
                {d.type}
              </option>
            ))}
        </Select>
      </FormControl>

      {!selectedFile && (
        <Button colorScheme="blue" onClick={refHandler}>
          Select File
        </Button>
      )}
      <input hidden ref={inputRef} type="file" onChange={handleFileChange} />

      {!!selectedFile && (
        <>
          <Divider />
          <HStack w="full" justify="center">
            <Text>{selectedFile.name}</Text>
            <IconButton
              size="sm"
              colorScheme="red"
              variant="ghost"
              aria-label="Remove file"
              icon={<DeleteIcon />}
              isDisabled={status === 'pending'}
              isLoading={status === 'pending'}
              onClick={() => setSelectedFile(() => null)}
            />
          </HStack>
        </>
      )}
    </VStack>
  );

  if (isFetching || isFetchingWards) {
    content = (
      <Center w="full" h="400px">
        <Spinner />
      </Center>
    );
  }

  if (!isFetching && isError) {
    content = (
      <Center w="full" h="400px">
        <VStack w="full" spacing="4">
          <VStack w="full">
            <WarningIcon fontSize="5xl" color="red.500" />
            <Text color="red.500">Error getting election types</Text>
          </VStack>

          <Button onClick={refetch}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  if (!isFetchingWards && isWardError) {
    content = (
      <Center w="full" h="400px">
        <VStack w="full" spacing="4">
          <VStack w="full">
            <WarningIcon fontSize="5xl" color="red.500" />
            <Text color="red.500">Error getting wards</Text>
          </VStack>

          <Button onClick={() => getWards(lga)}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onCloseComplete={() => {
        dispatch(reset());
        setWard('');
        setLga('');
        setSelectedFile(null);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>

        <ModalFooter>
          {!isFetching && !isError && !!selectedFile && (
            <Button
              mr={3}
              isDisabled={status === 'pending' || !ward || !electionType}
              isLoading={status === 'pending'}
              onClick={submitHandler}
            >
              Upload
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onClose}
            isDisabled={status === 'pending'}
            isLoading={status === 'pending'}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FileUpload;
