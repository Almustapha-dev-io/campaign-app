import { EditIcon } from '@chakra-ui/icons';
import {
  Stack,
  Avatar,
  AvatarBadge,
  IconButton,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Badge,
  Button,
  FormErrorMessage,
  chakra,
  VStack,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { editUserSchema, TEditUserProfileFormValues } from 'form-schemas/user';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { TUser } from 'types/user';
import ChangePassword from './ChangePassword';

type Props = {
  user: TUser;
};
function EditProfileForm({ user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<TEditUserProfileFormValues>({
    resolver: yupResolver(editUserSchema),
    mode: 'onChange',
  });
  const { isOpen, onClose, onOpen } = useDisclosure();

  const isActive = user.status === 'ACTIVE';

  const submitHandler: SubmitHandler<TEditUserProfileFormValues> = (values) => {
    console.log({ values });
    toast('User profile edit coming soon', { type: 'info' });
  };

  useEffect(() => {
    const opts = {
      /* shouldDirty: true, shouldTouch: true, */ shouldValidate: true,
    };
    setValue('email', user.email, opts);
    setValue('phoneNumber', user.phoneNumber ?? '', opts);
    setValue('firstName', user.firstName, opts);
    setValue('lastName', user.lastName, opts);
    setValue('profilePictureUrl', user.profilePictureUrl ?? '', opts);
  }, [setValue, user]);

  return (
    <>
      <ChangePassword isOpen={isOpen} onClose={onClose} />
      <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
        <VStack
          w="full"
          rounded="lg"
          bg="white"
          px={{ base: 4, md: 6, lg: 8 }}
          py="14"
          align="flex-start"
          spacing="8"
        >
          <HStack w="650px" maxW="full" spacing="6">
            <Avatar size="xl" src={user.profilePictureUrl}>
              <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                bottom="15px"
                aria-label="remove Image"
                icon={<EditIcon />}
              />
            </Avatar>

            <Badge
              mb="5"
              py="2"
              px="4"
              fontSize="md"
              rounded="full"
              colorScheme={isActive ? 'green' : 'red'}
            >
              {user.status}
            </Badge>
          </HStack>

          <Divider />

          <HStack>
            {user.roles.map((role) => (
              <Badge
                mb="5"
                py="2"
                px="4"
                fontSize="sm"
                fontWeight="medium"
                rounded="full"
                colorScheme="orange"
                key={role.id}
              >
                {role.name.split('_').join(' ')}
              </Badge>
            ))}
          </HStack>

          <SimpleGrid
            w="650px"
            maxW="full"
            columns={{ base: 1, md: 2 }}
            spacing="6"
          >
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email')} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Phone Number</FormLabel>
              <Input {...register('phoneNumber')} />
              <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input {...register('firstName')} />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input {...register('lastName')} />
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* <FormControl>
            <FormLabel>Roles</FormLabel>
            <UnorderedList>
              {user.roles.map((role) => (
                <ListItem key={role.id}>
                  {role.name.split('_').join(' ')}
                </ListItem>
              ))}
            </UnorderedList>
          </FormControl> */}

          <Stack
            w="650px"
            maxW="full"
            direction={{ base: 'column', md: 'row' }}
            spacing="4"
            justify="flex-end"
          >
            {isDirty && (
              <Button type="submit" isDisabled={!isValid}>
                Save Changes
              </Button>
            )}
            <Button variant="outline" onClick={onOpen}>
              Change Password
            </Button>
          </Stack>
        </VStack>
      </chakra.form>
    </>
  );
}

export default EditProfileForm;
