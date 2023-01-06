import { TSidebarItem } from 'types/sidebar';
import { FiUsers, FiSettings, FiUser, FiSliders, FiGrid } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegAddressCard } from 'react-icons/fa';
import { MdOutlineFeedback } from 'react-icons/md';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { Roles } from 'types/roles';

export const sidebarItems = (sidebarOpen: boolean): TSidebarItem[] => [
  {
    icon: FiGrid,
    label: 'Dashboard',
    sidebarOpen,
    url: '/dashboard',
    roles: [
      Roles.CallCenterAgent,
      Roles.ObservationRoomAgent,
      Roles.PartyAgent,
      Roles.SuperAdmin,
    ],
  },
  {
    icon: FiUsers,
    label: 'Users',
    sidebarOpen,
    url: '/users',
    roles: [Roles.SuperAdmin],
  },
  {
    icon: FiSliders,
    label: 'Roles',
    sidebarOpen,
    url: '/roles',
    roles: [Roles.SuperAdmin],
  },
  // {
  //   icon: FiSettings,
  //   label: 'Settings',
  //   sidebarOpen,
  //   url: '/settings',
  //   roles: [
  //     Roles.CallCenterAgent,
  //     Roles.ObservationRoomAgent,
  //     Roles.PartyAgent,
  //     Roles.SuperAdmin,
  //   ],
  // },
  {
    icon: FaRegAddressCard,
    label: 'Voters',
    sidebarOpen,
    url: '/voters',
    roles: [Roles.CallCenterAgent, Roles.SuperAdmin],
  },
  {
    icon: RiAccountPinBoxLine,
    label: 'Votes',
    sidebarOpen,
    url: '/votes',
    roles: [Roles.PartyAgent, Roles.SuperAdmin],
  },
  {
    icon: BsBoxSeam,
    label: 'Election Types',
    sidebarOpen,
    url: '/election-types',
    roles: [Roles.SuperAdmin],
  },
  {
    icon: MdOutlineFeedback,
    label: 'Media Feedback',
    sidebarOpen,
    url: '/feedback',
    roles: [Roles.ObservationRoomAgent, Roles.SuperAdmin],
  },
  {
    icon: FiUser,
    label: 'Profile',
    sidebarOpen,
    url: '/profile',
    roles: [
      Roles.CallCenterAgent,
      Roles.ObservationRoomAgent,
      Roles.PartyAgent,
      Roles.SuperAdmin,
    ],
  },
];