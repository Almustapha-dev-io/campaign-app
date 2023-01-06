import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  chakra,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePassword } from 'api/auth';
import {
  changePasswordSchema,
  TChangePasswordFormValues,
} from 'form-schemas/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { startTask } from 'store/reducers/auth-slice';

type Props = Omit<ModalProps, 'children'>;

function ChangePassword({ isOpen, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const { status, error } = useAppSelector((s) => s.auth);

  const dispatch = useAppDispatch();
  const submitHandler: SubmitHandler<TChangePasswordFormValues> = (values) => {
    dispatch(startTask());
    dispatch(changePassword(values.newPassword));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={status !== 'pending'}
      closeOnOverlayClick={status !== 'pending'}
      onCloseComplete={() => {
        reset({});
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        {status !== 'pending' && <ModalCloseButton />}
        <ModalBody>
          <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
            <VStack w="full" spacing="8" pb="4">
              <VStack w="full" spacing="4">
                {!!error && (
                  <Alert status="error" rounded="lg">
                    <AlertIcon />
                    <AlertDescription fontSize="sm">{error}</AlertDescription>
                  </Alert>
                )}
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Current Password</FormLabel>
                  <Input type="password" {...register('password')} />
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.newPassword}>
                  <FormLabel>New Password</FormLabel>
                  <Input type="password" {...register('newPassword')} />
                  <FormErrorMessage>
                    {errors.newPassword?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormLabel>Confrim New Password</FormLabel>
                  <Input type="password" {...register('confirmPassword')} />
                  <FormErrorMessage>
                    {errors.confirmPassword?.message}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
              <Button
                w="full"
                isDisabled={!isValid || status === 'pending'}
                isLoading={status === 'pending'}
                type="submit"
              >
                Save
              </Button>
            </VStack>
          </chakra.form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ChangePassword;
