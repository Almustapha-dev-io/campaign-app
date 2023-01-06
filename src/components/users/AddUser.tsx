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
  DrawerProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Text,
  VStack,
  chakra,
  Select,
} from '@chakra-ui/react';
import { useGetRolesQuery } from 'store/reducers/roles-api-slices';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import addUserSchema, { TAddUserFormValues } from 'form-schemas/user';
import ControlledSelect from 'components/ControlledSelect';
import { WarningIcon } from '@chakra-ui/icons';
import { useAddUserMutation } from 'store/reducers/users-api-slice';
import { useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from 'contexts/user';
import getServerErrorMessage from 'utilities/getServerErrorMessage';
import {
  useGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';

type Props = Omit<DrawerProps, 'children'> & {};

function AddUser({ isOpen, onClose }: Props) {
  const { setSelectedUser, selectedUser } = useContext(UserContext);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const { data, isFetching, isError, refetch } = useGetRolesQuery();
  const {
    data: lgas,
    isFetching: isFetchingLgs,
    isError: isLgaError,
    refetch: refetchLga,
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
    addUser,
    { isError: isAddError, isLoading, isSuccess, error, reset: resetMutation },
  ] = useAddUserMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    resetField,
    formState: { errors, isValid },
  } = useForm<TAddUserFormValues>({
    resolver: yupResolver(addUserSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isAddError && !isLoading && error) {
      toast(getServerErrorMessage(error), { type: 'error' });
    }
  }, [isAddError, isLoading, error]);

  useEffect(() => {
    if (isSuccess && !isLoading && isOpen) {
      toast(`User successfully ${selectedUser ? 'updated' : 'added'}!`, {
        type: 'success',
      });

      if (!selectedUser) {
        onClose();
      }
    }
  }, [isSuccess, isLoading, selectedUser, onClose, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const validationData = {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      };
      if (selectedUser) {
        setValue('email', selectedUser.email, validationData);
        setValue('firstName', selectedUser.firstName, validationData);
        setValue('lastName', selectedUser.lastName, validationData);
        if (selectedUser.ward) {
          setValue(
            'lgaId',
            selectedUser.ward.localGovernment.id,
            validationData
          );

          setValue('wardId', selectedUser.ward.id, validationData);
        }
        setValue(
          'phoneNumber',
          selectedUser.phoneNumber ? selectedUser.phoneNumber : '',
          validationData
        );

        let role: any = null;
        if (selectedUser.roles.length) {
          role = {
            label: selectedUser.roles[0].name,
            value: selectedUser.roles[0].id.toString(),
          };
        }
        setValue('roleIds', role, validationData);
      }
    }
  }, [isOpen, setValue, selectedUser, reset]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'lgaId') {
        if (!selectedUser) {
          resetField('wardId');
        }
        if (value.lgaId) {
          getWards(value.lgaId.toString());
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [getWards, resetField, selectedUser, watch]);

  const submitHandler: SubmitHandler<TAddUserFormValues> = (values) => {
    const roles: number[] = [];
    if (values.roleIds) {
      roles.push(+values.roleIds.value);
    }

    if (!selectedUser) {
      addUser({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        profilePictureUrl: values.profilePictureUrl
          ? values.profilePictureUrl
          : '',
        roleIds: roles,
        password: 'user1234',
        wardId: values.wardId,
      });
      return;
    }

    toast('User update coming soon...', { type: 'info' });
  };

  let content = (
    <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
      <VStack w="full" spacing="4" mt="6">
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" type="email" {...register('email')} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.firstName}>
          <FormLabel htmlFor="firstName">First Name</FormLabel>
          <Input id="firstName" {...register('firstName')} />
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.lastName}>
          <FormLabel htmlFor="lastName">Last Name</FormLabel>
          <Input id="lastName" {...register('lastName')} />
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.phoneNumber}>
          <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
          <Input id="phoneNumber" {...register('phoneNumber')} />
          <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.lgaId}>
          <FormLabel>Local Gov't</FormLabel>
          <Select {...register('lgaId')}>
            <option value="">Select one</option>
            {!!lgas
              ? lgas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))
              : null}
          </Select>
          <FormErrorMessage>{errors.lgaId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!errors.wardId}
          isDisabled={!getValues('lgaId')}
        >
          <FormLabel>Ward</FormLabel>
          <Select {...register('wardId')}>
            <option value="">Select one</option>
            {!!wards
              ? wards.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))
              : null}
          </Select>
          <FormErrorMessage>{errors.wardId?.message}</FormErrorMessage>
        </FormControl>

        <ControlledSelect<
          TAddUserFormValues,
          TAddUserFormValues['roleIds'],
          false
        >
          useBasicStyles
          name="roleIds"
          control={control}
          label="Roles Id"
          placeholder="Select role"
          options={
            data
              ? data.map((o) => ({
                  label: o.name,
                  value: o.id.toString(),
                }))
              : []
          }
          selectedOptionStyle="check"
          isLoading={isFetching}
        />

        {!!selectedUser === false && (
          <FormControl isReadOnly>
            <FormLabel htmlFor="phoneNumber">Default Password</FormLabel>
            <Input id="phoneNumber" value="user1234" />
          </FormControl>
        )}

        <Button type="submit" display="none" ref={submitBtnRef}>
          submit
        </Button>
      </VStack>
    </chakra.form>
  );

  if (isFetching || isFetchingLgs || isFetchingWards) {
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
            <Text color="red.500">Error getting roles</Text>
          </VStack>

          <Button onClick={refetch}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  if (!isFetchingLgs && isLgaError) {
    content = (
      <Center w="full" h="400px">
        <VStack w="full" spacing="4">
          <VStack w="full">
            <WarningIcon fontSize="5xl" color="red.500" />
            <Text color="red.500">Error getting Local Gov'ts</Text>
          </VStack>

          <Button onClick={refetchLga}>Retry</Button>
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
            <Text color="red.500">Error getting Wards</Text>
          </VStack>

          <Button onClick={() => getWards(getValues('lgaId').toString())}>
            Retry
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Drawer
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: 'full', md: 'sm' }}
      onCloseComplete={() => {
        setSelectedUser(null);
        reset({});
        resetMutation();
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        {!isLoading && <DrawerCloseButton />}
        <DrawerHeader>{selectedUser ? 'Update' : 'Register'} User</DrawerHeader>

        <DrawerBody>{content}</DrawerBody>

        <DrawerFooter>
          {!isFetching && !isError && (
            <Button
              mr={3}
              isLoading={isLoading}
              onClick={() => {
                if (submitBtnRef.current) {
                  submitBtnRef.current.click();
                }
              }}
              isDisabled={!isValid || isLoading}
            >
              Save
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddUser;
