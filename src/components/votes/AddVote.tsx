import { WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  chakra,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useBreakpointValue,
  Center,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { VoteContext } from 'contexts/vote';
import { TVoteForm, voteSchema } from 'form-schemas/vote';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLazyGetPoliticalPartyQuery } from 'store/reducers/political-party-api-slice';

import {
  useAddVoteMutation,
  useUpdateVoteMutation,
} from 'store/reducers/votes-api-slice';
import { Roles } from 'types/roles';
import { TUser } from 'types/user';
import getServerErrorMessage from 'utilities/getServerErrorMessage';
import hasRoles from 'utilities/hasRole';

type Props = {
  user: TUser;
};

function AddVote({ user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<TVoteForm>({
    resolver: yupResolver(voteSchema),
    mode: 'onChange',
  });
  const { selectedVote, setSelectedVote, isOpen, onClose } =
    useContext(VoteContext);

  const [getParties, { data, isFetching, isError }] =
    useLazyGetPoliticalPartyQuery();
  const loadParties = useCallback(() => {
    getParties({ page: 0, size: 1_000 });
  }, [getParties]);

  const [
    addVote,
    {
      isLoading: isAdding,
      isSuccess: isAdded,
      reset: resetAdd,
      error: addError,
      isError: isAddError,
    },
  ] = useAddVoteMutation();

  const [
    updateVote,
    {
      isLoading: isUpdating,
      isSuccess: isUpdated,
      reset: resetUpdate,
      error: updateError,
      isError: isUpdateError,
    },
  ] = useUpdateVoteMutation();

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TVoteForm> = (values) => {
    if (!selectedVote) {
      addVote({
        ...values,
        pollingUnitId: user.pollingUnit ? user.pollingUnit.id.toString() : '',
      });
      return;
    }

    updateVote({
      id: selectedVote.id,
      ...values,
      pollingUnitId: user.pollingUnit ? user.pollingUnit.id.toString() : '',
    });
  };

  const { field, fieldState } = useController({
    control,
    name: 'numberOfVotes',
  });

  let content = (
    <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" pt="4" spacing="8">
        <FormControl isReadOnly>
          <FormLabel>LG</FormLabel>
          <Input
            value={
              user.pollingUnit?.ward?.localGovernment?.name ??
              selectedVote?.pollingUnit.ward.localGovernment.name
            }
          />
        </FormControl>

        <FormControl isReadOnly>
          <FormLabel>Ward</FormLabel>
          <Input
            value={
              user.pollingUnit?.ward?.name ??
              selectedVote?.pollingUnit.ward.name
            }
          />
        </FormControl>

        <FormControl isReadOnly>
          <FormLabel>Polling Unit</FormLabel>
          <Input {...register('pollingUnitId')} />
        </FormControl>

        {/* <FormControl>
      <FormLabel>Vote Type</FormLabel>
      <Select>
        <option selected hidden>
          Select One
        </option>
        <option value="registed">Registered Votes</option>
        <option value="accredited">Accredited Votes</option>
        <option value="recorded">Recorded Votes</option>
        <option value="invalid">Invalid Votes</option>
      </Select>
    </FormControl> */}

        <FormControl isInvalid={!!errors.party}>
          <FormLabel>Party</FormLabel>
          <Select defaultValue="" {...register('party')}>
            <option value="" hidden>
              Select one
            </option>
            {!!data &&
              data.data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.id}
                </option>
              ))}
          </Select>
        </FormControl>

        <FormControl isInvalid={!!fieldState.error}>
          <FormLabel>Votes</FormLabel>
          <NumberInput
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            ref={field.ref}
            name={field.name}
            precision={0}
            min={0}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" display="none" ref={submitBtnRef} />
      </VStack>
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
            <Text color="red.500">Error getting parties</Text>
          </VStack>
          <Button onClick={loadParties}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  useEffect(() => {
    if (isOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };

      setValue('pollingUnitId', user.pollingUnit ? user.pollingUnit.name : '');
      if (selectedVote) {
        setValue('pollingUnitId', selectedVote.pollingUnit.name);
        setValue('numberOfVotes', selectedVote.numberOfVotes);
        setValue('party', selectedVote.party.id);
      }
    }
  }, [isOpen, selectedVote, setValue, user]);

  useEffect(() => {
    if (isAdded && !isAdding && isOpen) {
      toast(`Vote successfully added`, {
        type: 'success',
      });

      onClose();
    }
  }, [isAdded, isAdding, onClose, isOpen]);

  useEffect(() => {
    if (isUpdated && !isUpdating && isOpen) {
      toast(`Vote details successfully updated`, {
        type: 'success',
      });
    }
  }, [isUpdated, isUpdating, onClose, isOpen]);

  useEffect(() => {
    if (isAddError && !isAdding && addError) {
      toast(getServerErrorMessage(addError), { type: 'error' });
    }
  }, [isAddError, isAdding, addError]);

  useEffect(() => {
    if (isUpdateError && !isUpdating && updateError) {
      toast(getServerErrorMessage(updateError), { type: 'error' });
    }
  }, [isUpdateError, isUpdating, updateError]);

  useEffect(() => {
    loadParties();
  }, [loadParties]);

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Drawer
      blockScrollOnMount={isDesktop}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: 'full', md: 'sm' }}
      onCloseComplete={() => {
        setSelectedVote(null);
        reset({});
        resetAdd();
        resetUpdate();
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        {!isUpdating && !isAdding && <DrawerCloseButton />}
        <DrawerHeader>{selectedVote ? 'Update' : 'Add'} Votes</DrawerHeader>

        <DrawerBody>{content}</DrawerBody>

        <DrawerFooter>
          {hasRoles(user, new Set([Roles.PartyAgent])) &&
            !isFetching &&
            !isError && (
              <Button
                mr={3}
                isDisabled={!isValid || isAdding || isUpdating}
                isLoading={isAdding || isUpdating}
                onClick={() => {
                  if (submitBtnRef.current) {
                    submitBtnRef.current.click();
                  }
                }}
              >
                Save
              </Button>
            )}

          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddVote;
