import { TPollingUnit } from './polling-unit';
import { TRole } from './roles';
import { TWard } from './ward';

export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  registeredDate: string;
  profilePictureUrl: string;
  roles: TRole[];
  status: string;
  phoneNumber: string;
  enabled: boolean;
  username: string;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  ward?: TWard;
  pollingUnit?: TPollingUnit;
};

export type LoginDTO = {
  username: string;
  password: string;
};

export type TLoginServerResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
  userInfo: TUser;
};

export type UserDTO = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  roleIds: number[];
  profilePictureUrl: string;
};

export type TUserAnalyticsResponse = {
  role: string;
  total: number;
};
