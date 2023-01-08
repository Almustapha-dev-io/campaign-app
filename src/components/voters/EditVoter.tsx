import { WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Spinner,
  Text,
  Textarea,
  VStack,
  chakra,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { VoterContext } from 'contexts/voter';
import { format } from 'date-fns';
import voterResponseSchema, {
  TVoterResponseForm,
} from 'form-schemas/voter-response';
import { useContext, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import uuid from 'react-uuid';
import { useGetElectionTypesQuery } from 'store/reducers/election-type-api-slice';
import { useAddVoterResponseMutation } from 'store/reducers/voters-api-slice';
import { VotedParty, VoterStatus } from 'types/voter';
import getServerErrorMessage from 'utilities/getServerErrorMessage';

function EditVoter() {
  const { editOpen, onEditClose, selectedVoterToEdit, setSelectedVoter } =
    useContext(VoterContext);
  const { data, isFetching, isError, refetch } = useGetElectionTypesQuery();
  const [
    addResponse,
    {
      isLoading: isAdding,
      isSuccess: isAdded,
      reset: resetAdd,
      error: addError,
      isError: isAddError,
    },
  ] = useAddVoterResponseMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<TVoterResponseForm>({
    resolver: yupResolver(voterResponseSchema),
    mode: 'onChange',
  });

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TVoterResponseForm> = ({
    dateCalled,
    ...values
  }) => {
    if (!selectedVoterToEdit || isAdding) return;

    addResponse({
      votersDetailsId: selectedVoterToEdit.id,
      ...values,
      dateCalled: format(dateCalled, 'dd/MM/yyyy hh:ss'),
    });
  };

  let content = (
    <chakra.form onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="4">
        <FormControl isInvalid={!!errors.votedParty}>
          <FormLabel>Voted Party</FormLabel>
          <Select defaultValue="" {...register('votedParty')}>
            <option value="" hidden>
              Select one
            </option>
            <option value={VotedParty.PDP}>PDP</option>
            <option value={VotedParty.APC}>APC</option>
            <option value={VotedParty.OTHERS}>Others</option>
          </Select>
          <FormErrorMessage>{errors.votedParty?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.electionTypeId}>
          <FormLabel>Election Type</FormLabel>
          <Select defaultValue="" {...register('electionTypeId')}>
            <option value="" hidden>
              Select one
            </option>
            {data
              ? data.map((e) => (
                  <option key={uuid()} value={e.id}>
                    {e.type}
                  </option>
                ))
              : null}
          </Select>
          <FormErrorMessage>{errors.electionTypeId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.reasonForVoting}>
          <FormLabel>Reason for Voting</FormLabel>
          <Textarea rows={2} {...register('reasonForVoting')} />
          <FormErrorMessage>{errors.reasonForVoting?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.status}>
          <FormLabel>Status</FormLabel>
          <Select defaultValue="" {...register('status')}>
            <option value="" hidden>
              Select one
            </option>
            <option value={VoterStatus.DONE}>Called</option>
            <option value={VoterStatus.PENDING}>Pending</option>
          </Select>
          <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.agentRemark}>
          <FormLabel>Remark</FormLabel>
          <Textarea rows={2} {...register('agentRemark')} />
          <FormErrorMessage>{errors.agentRemark?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.dateCalled}>
          <FormLabel>Date Called</FormLabel>
          <Input type="date" {...register('dateCalled')} />
          <FormErrorMessage>{errors.dateCalled?.message}</FormErrorMessage>
        </FormControl>
      </VStack>

      <Button display="none" type="submit" ref={submitBtnRef}></Button>
    </chakra.form>
  );

  if (isFetching) {
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

  useEffect(() => {
    if (editOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };

      if (selectedVoterToEdit) {
        setValue('votedParty', selectedVoterToEdit.votedParty);
        setValue('reasonForVoting', selectedVoterToEdit.reasonForVoting);
        setValue('status', selectedVoterToEdit.status);
        setValue('dateCalled', new Date(selectedVoterToEdit.dateCalled));
        setValue('agentRemark', selectedVoterToEdit.agentRemark);
        setValue(
          'electionTypeId',
          selectedVoterToEdit.electionType.id.toString()
        );
      }
    }
  }, [editOpen, selectedVoterToEdit, setValue]);

  useEffect(() => {
    if (isAdded && !isAdding && editOpen) {
      toast(`Voter response successfully added`, {
        type: 'success',
      });

      onEditClose();
    }
  }, [isAdded, isAdding, onEditClose, editOpen]);

  useEffect(() => {
    if (isAddError && !isAdding && addError) {
      toast(getServerErrorMessage(addError), { type: 'error' });
    }
  }, [isAddError, isAdding, addError]);

  return (
    <Drawer
      blockScrollOnMount={false}
      isOpen={editOpen}
      placement="right"
      onClose={onEditClose}
      onCloseComplete={() => {
        setSelectedVoter({ voter: null, isEdit: true });
        reset({});
        resetAdd();
      }}
      size="sm"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Voter Response</DrawerHeader>
        <DrawerBody>{content}</DrawerBody>

        <DrawerFooter>
          {!isFetching && !isError && (
            <Button
              mr={3}
              isDisabled={!isValid || isAdding}
              isLoading={isAdding}
              onClick={() => {
                if (submitBtnRef.current) {
                  submitBtnRef.current.click();
                }
              }}
            >
              Save
            </Button>
          )}
          <Button variant="outline" isDisabled={isAdding} onClick={onEditClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditVoter;
