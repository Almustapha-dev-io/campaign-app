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
import { PoliticalPartyContext } from 'contexts/political-parties';
import politicalPartySchema, {
  TPoliticalPartyForm,
} from 'form-schemas/political-party';
import { useContext, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  useAddPartyMutation,
  useUpdatePartyMutation,
} from 'store/reducers/political-party-api-slice';

type Props = Omit<DrawerProps, 'children'> & {};

function AddPoliticalParty({ isOpen, onClose, ...rest }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<TPoliticalPartyForm>({
    resolver: yupResolver(politicalPartySchema),
    mode: 'onChange',
  });

  const { selectPoliticalParty, setSelectedPoliticalParty } = useContext(
    PoliticalPartyContext
  );

  const [
    addParty,
    { isLoading: isAdding, isSuccess: isAdded, reset: resetAdd },
  ] = useAddPartyMutation();

  const [
    updateParty,
    { isLoading: isUpdating, isSuccess: isUpdated, reset: resetUpdate },
  ] = useUpdatePartyMutation();

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TPoliticalPartyForm> = (values) => {
    if (!selectPoliticalParty) {
      addParty(values);
      return;
    }

    updateParty(values);
  };

  useEffect(() => {
    if (isOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };

      if (selectPoliticalParty) {
        setValue('id', selectPoliticalParty.id, validationData);
        setValue('name', selectPoliticalParty.name, validationData);
      }
    }
  }, [isOpen, selectPoliticalParty, setValue]);

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
        setSelectedPoliticalParty(null);
        reset({});
        resetAdd();
        resetUpdate();
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        {!false && <DrawerCloseButton />}
        <DrawerHeader>
          {selectPoliticalParty ? 'Update' : 'Add'} Political Party
        </DrawerHeader>

        <DrawerBody>
          <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
            <VStack w="full" pt="8" spacing="8">
              <FormControl isInvalid={!!errors.id}>
                <FormLabel>Party Code</FormLabel>
                <Input {...register('id')} />
                <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Party Name</FormLabel>
                <Input {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
            </VStack>

            <Button type="submit" display="none" ref={submitBtnRef} />
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

export default AddPoliticalParty;
