import {
  chakra,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Logo from 'components/layout/Sidebar/Logo';
import loginSchema, { TLoginFormValues } from 'form-schemas/login';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { startTask } from 'store/reducers/auth-slice';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { logIn } from 'api/auth';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TLoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const { isAuth } = useAuth();

  const submitHandler: SubmitHandler<TLoginFormValues> = (values) => {
    dispatch(startTask());
    dispatch(logIn(values));
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  return (
    <Box w="full" h="full" bg="green.50">
      <Container
        maxW="lg"
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack
              spacing={{ base: '2', md: '3' }}
              align="center"
              textAlign="center"
            >
              <Logo width="100px" height="100px" />
              <Heading
                fontWeight="semibold"
                size={useBreakpointValue({ base: 'sm', md: 'md' })}
              >
                Log in to your account
              </Heading>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg="white"
            boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <chakra.form w="full" onSubmit={handleSubmit(submitHandler)}>
              <Stack spacing="6">
                <Stack spacing="5">
                  {!!error && (
                    <Alert status="error" rounded="lg">
                      <AlertIcon />
                      <AlertDescription fontSize="sm">{error}</AlertDescription>
                    </Alert>
                  )}
                  <FormControl isInvalid={!!errors.username}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" type="email" {...register('username')} />
                    <FormErrorMessage>
                      {errors.username?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                    />
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>

                {/* <HStack justify="flex-end">
                  <Button variant="link" size="sm">
                    Forgot password?
                  </Button>
                </HStack> */}

                <Button
                  variant="solid"
                  w="full"
                  type="submit"
                  isLoading={status === 'pending'}
                  isDisabled={!isValid || status === 'pending'}
                >
                  Sign in
                </Button>
              </Stack>
            </chakra.form>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
