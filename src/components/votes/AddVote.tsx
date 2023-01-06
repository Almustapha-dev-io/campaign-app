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
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { VoteContext } from 'contexts/vote';
import { TVoteForm, voteSchema } from 'form-schemas/vote';
import { useContext, useEffect, useRef } from 'react';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

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
        wardId: user.ward ? user.ward.id.toString() : '',
      });
      return;
    }

    updateVote({
      id: selectedVote.id,
      ...values,
      wardId: user.ward ? user.ward.id.toString() : '',
    });
  };

  const { field, fieldState } = useController({
    control,
    name: 'numberOfVotes',
  });

  useEffect(() => {
    if (isOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };

      setValue('wardId', user.ward ? user.ward.name : '');
      if (selectedVote) {
        setValue('wardId', selectedVote.ward.name);
        setValue('numberOfVotes', selectedVote.numberOfVotes);
        setValue('party', selectedVote.party);
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

        <DrawerBody>
          <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
            <VStack w="full" pt="4" spacing="8">
              <FormControl isReadOnly>
                <FormLabel>LG</FormLabel>
                <Input value={user.ward?.localGovernment?.name} />
              </FormControl>

              <FormControl isReadOnly>
                <FormLabel>Ward</FormLabel>
                <Input {...register('wardId')} />
              </FormControl>

              <FormControl isReadOnly>
                <FormLabel>Polling Unit</FormLabel>
                <Input {...register('wardId')} />
              </FormControl>

              <FormControl>
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
              </FormControl>

              <FormControl isInvalid={!!errors.party}>
                <FormLabel>Party</FormLabel>
                <Select defaultValue="" {...register('party')}>
                  <option value="" hidden>
                    Select one
                  </option>
                  <option value="APC">APC</option>
                  <option value="PDP">PDP</option>
                  <option value="OTHERS">OTHERS</option>
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
        </DrawerBody>

        <DrawerFooter>
          {hasRoles(user, new Set([Roles.PartyAgent])) && (
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
