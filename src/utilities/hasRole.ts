import { Roles } from 'types/roles';
import { TUser } from 'types/user';

const hasRoles = (user: TUser, roles: Set<Roles>) => {
  return user.roles.some((role) => roles.has(role.name));
};

export default hasRoles;
