import * as yup from 'yup';

export type TLoginFormValues = {
  username: string;
  password: string;
};

const loginSchema = yup.object().shape({
  username: yup.string().email().required().label('Username'),
  password: yup.string().min(4).required().label('Password'),
});

export default loginSchema;
