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
    formState: { errors, isValid },
  } = useForm<TFeedbackForm>({
    resolver: yupResolver(feedbackSchema),
    mode: 'onChange',
  });
  const { selectedFeedback, setSelectedFeedback, isOpen, onClose } =
    useContext(FeedbackContext);

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
        wardId: user.ward ? user.ward.id.toString() : '',
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

      setValue('wardId', user.ward ? user.ward.name : '');
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
              <FormControl isReadOnly isDisabled>
                <FormLabel>Ward</FormLabel>
                <Input {...register('wardId')} />
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
