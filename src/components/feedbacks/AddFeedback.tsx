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
  Textarea,
  Select,
  Input,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FeedbackContext } from 'contexts/feedback';
import feedbackSchema, { TFeedbackForm } from 'form-schemas/feedback';
import { useContext, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  useAddFeedbackMutation,
  useUpdateFeedbackMutation,
} from 'store/reducers/feedback-api-slice';
import {
  useGetLGAsQuery,
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { FeedbackChannels } from 'types/feedback';
import { Roles } from 'types/roles';
import { TUser } from 'types/user';
import getServerErrorMessage from 'utilities/getServerErrorMessage';
import hasRoles from 'utilities/hasRole';

type Props = {
  user: TUser;
};

function AddFeedback({ user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors, isValid },
  } = useForm<TFeedbackForm>({
    resolver: yupResolver(feedbackSchema),
    mode: 'onChange',
  });
  const { selectedFeedback, setSelectedFeedback, isOpen, onClose } =
    useContext(FeedbackContext);

  const {
    isFetching: isFetchingLgs,
    data: lgas,
    isError: isLgaError,
    error: lgaError,
  } = useGetLGAsQuery();

  const [
    getWards,
    {
      isFetching: isFetchingWards,
      data: wards,
      isError: isWardError,
      error: wardError,
    },
  ] = useLazyGetWardsQuery();

  const [
    addFeedback,
    {
      isLoading: isAdding,
      isSuccess: isAdded,
      reset: resetAdd,
      error: addError,
      isError: isAddError,
    },
  ] = useAddFeedbackMutation();

  const [
    updateFeedback,
    {
      isLoading: isUpdating,
      isSuccess: isUpdated,
      reset: resetUpdate,
      error: updateError,
      isError: isUpdateError,
    },
  ] = useUpdateFeedbackMutation();

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TFeedbackForm> = (values) => {
    if (!selectedFeedback) {
      addFeedback({
        ...values,
      });
      return;
    }

    updateFeedback({
      feedbackId: selectedFeedback.id,
      ...values,
      wardId: user.ward ? user.ward.id.toString() : '',
    });
  };

  useEffect(() => {
    if (isOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };

      // setValue('wardId', user.ward ? user.ward.name : '');
      if (selectedFeedback) {
        setValue('wardId', selectedFeedback.ward.name);
        setValue('comment', selectedFeedback.comment);
      }
    }
  }, [isOpen, selectedFeedback, setValue, user]);

  useEffect(() => {
    if (isAdded && !isAdding && isOpen) {
      toast(`Feedback successfully added`, {
        type: 'success',
      });

      onClose();
    }
  }, [isAdded, isAdding, onClose, isOpen]);

  useEffect(() => {
    if (isUpdated && !isUpdating && isOpen) {
      toast(`Feedback successfully updated`, {
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
    const subscription = watch((value, { name }) => {
      console.log(value);

      if (name === 'lgaId') {
        if (!selectedFeedback) {
          resetField('wardId');
        }
        if (value.lgaId) {
          getWards(value.lgaId.toString());
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [getWards, resetField, selectedFeedback, watch]);

  return (
    <Drawer
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: 'full', md: 'sm' }}
      onCloseComplete={() => {
        setSelectedFeedback(null);
        reset({});
        resetAdd();
        resetUpdate();
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        {!isUpdating && !isAdding && <DrawerCloseButton />}
        <DrawerHeader>
          {selectedFeedback ? 'Update' : 'Add'} Feedback
        </DrawerHeader>

        <DrawerBody>
          <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
            <VStack w="full" pt="8" spacing="8">
              <FormControl>
                <FormLabel>Local Gov't</FormLabel>
                <Select {...register('lgaId')} defaultValue="">
                  <option value="" selected hidden>
                    Select One
                  </option>
                  {!!lgas
                    ? lgas.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))
                    : null}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Ward</FormLabel>
                <Select {...register('wardId')} defaultValue="">
                  <option value="" selected hidden>
                    Select One
                  </option>
                  {!!wards
                    ? wards.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))
                    : null}
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.channel}>
                <FormLabel>Channel</FormLabel>
                <Select defaultValue="" {...register('channel')}>
                  <option value="" hidden>
                    Select one
                  </option>
                  {Object.values(FeedbackChannels).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.comment}>
                <FormLabel>Voter Comment</FormLabel>
                <Textarea rows={4} resize="none" {...register('comment')} />
                <FormErrorMessage>{errors.comment?.message}</FormErrorMessage>
              </FormControl>

              <Button type="submit" display="none" ref={submitBtnRef} />
            </VStack>
          </chakra.form>
        </DrawerBody>

        <DrawerFooter>
          {hasRoles(user, new Set([Roles.ObservationRoomAgent])) && (
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

export default AddFeedback;
