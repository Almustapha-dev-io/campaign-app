import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  chakra,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ElectionTypesContext } from 'contexts/election-types';
import electionTypeSchema, {
  TElectionTypeForm,
} from 'form-schemas/election-type';
import { useContext, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  useAddElectionTypeMutation,
  useUpdateElectionTypeMutation,
} from 'store/reducers/election-type-api-slice';

type Props = Omit<DrawerProps, 'children'> & {};

function AddElectionType({ isOpen, onClose, ...rest }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<TElectionTypeForm>({
    resolver: yupResolver(electionTypeSchema),
    mode: 'onChange',
  });
  const { selectedElectionType, setSelectedElectionType } =
    useContext(ElectionTypesContext);

  const [
    addElectionType,
    { isLoading: isAdding, isSuccess: isAdded, reset: resetAdd },
  ] = useAddElectionTypeMutation();

  const [
    updateElectionType,
    { isLoading: isUpdating, isSuccess: isUpdated, reset: resetUpdate },
  ] = useUpdateElectionTypeMutation();

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TElectionTypeForm> = (values) => {
    if (!selectedElectionType) {
      addElectionType({
        ...values,
      });
      return;
    }

    updateElectionType({
      id: selectedElectionType.id,
      ...values,
    });
  };

  useEffect(() => {
    if (isOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };

      if (selectedElectionType) {
        setValue('type', selectedElectionType.type, validationData);
        setValue(
          'description',
          selectedElectionType.description,
          validationData
        );
      }
    }
  }, [isOpen, selectedElectionType, setValue]);

  useEffect(() => {
    if (isAdded && !isAdding && isOpen) {
      toast(`Election type successfully added`, {
        type: 'success',
      });

      onClose();
    }
  }, [isAdded, isAdding, onClose, isOpen]);

  useEffect(() => {
    if (isUpdated && !isUpdating && isOpen) {
      toast(`Election type successfully updated`, {
        type: 'success',
      });
    }
  }, [isUpdated, isUpdating, onClose, isOpen]);

  return (
    <Drawer
      blockScrollOnMount={false}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: 'full', md: 'sm' }}
      onCloseComplete={() => {
        setSelectedElectionType(null);
        reset({});
        resetAdd();
        resetUpdate();
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        {!false && <DrawerCloseButton />}
        <DrawerHeader>
          {selectedElectionType ? 'Update' : 'Add'} Election Type
        </DrawerHeader>

        <DrawerBody>
          <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
            <VStack w="full" pt="8" spacing="8">
              <FormControl isInvalid={!!errors.type}>
                <FormLabel>Election Type</FormLabel>
                <Input {...register('type')} />
                <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Descrition</FormLabel>
                <Textarea rows={4} resize="none" {...register('description')} />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>

              <Button type="submit" display="none" ref={submitBtnRef} />
            </VStack>
          </chakra.form>
        </DrawerBody>

        <DrawerFooter>
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

          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddElectionType;
