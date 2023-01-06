import { IconType } from 'react-icons';
import { Roles } from './roles';

export type TSidebarItem = {
  url: string;
  sidebarOpen: boolean;
  icon: IconType;
  label: string;
  roles: Roles[];
};
