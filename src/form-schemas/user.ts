import * as yup from 'yup';

export type TAddUserFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl: string;
  roleIds: string;
  wardId: number;
  lgaId: number;
  pollingUnitId: number;
};

const addUserSchema = yup.object().shape({
  email: yup.string().email().required().label('Email'),
  firstName: yup.string().min(2).required().label('First name'),
  lastName: yup.string().min(2).required().label('Last name'),
  phoneNumber: yup.string().min(4).required().label('Phone number'),
  profilePictureUrl: yup.string(),
  roleIds: yup.string().label('Role Ids').required(),
  wardId: yup
    .number()
    .when('roleIds', {
      is: '4',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema,
    })
    .label('Ward ID'),
  pollingUnitId: yup
    .number()
    .when('roleIds', {
      is: '4',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema,
    })
    .label('Polling Unit ID'),
  lgaId: yup
    .number()
    .when('roleIds', {
      is: '4',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema,
    })
    .label("Local Gov't ID"),
});

export type TEditUserProfileFormValues = Pick<
  TAddUserFormValues,
  'email' | 'phoneNumber' | 'firstName' | 'lastName' | 'profilePictureUrl'
>;

export const editUserSchema = yup.object().shape({
  email: yup.string().email().required().label('Email'),
  firstName: yup.string().min(2).required().label('First name'),
  lastName: yup.string().min(2).required().label('Last name'),
  phoneNumber: yup.string().label('Phone number'),
  profilePictureUrl: yup.string(),
  wardId: yup.number().required().label('Ward ID'),
  lgaId: yup.number().required().label("Local Gov't ID"),
});

export type TChangePasswordFormValues = Record<
  'password' | 'newPassword' | 'confirmPassword',
  string
>;

export const changePasswordSchema = yup.object().shape({
  password: yup.string().min(8).required(),
  newPassword: yup.string().min(8).required().label('Password'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('newPassword'), '', undefined, null],
      'Passwords must match!'
    )
    .required()
    .label('Repeated password'),
});
export default addUserSchema;
