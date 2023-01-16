import { TSidebarItem } from 'types/sidebar';
import { FiUsers, FiUser, FiSliders, FiGrid } from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaRegAddressCard } from 'react-icons/fa';
import {
  MdOutlineFeedback,
  MdOutlineGroupWork,
  MdOutlinePermMedia,
  MdWifiOff,
} from 'react-icons/md';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { BiMessageSquareDetail } from 'react-icons/bi';
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
    icon: MdOutlineGroupWork,
    label: 'Political Parties',
    sidebarOpen,
    url: '/political-parties',
    roles: [Roles.SuperAdmin],
  },
  {
    icon: FaRegAddressCard,
    label: 'Contacts',
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
    icon: BiMessageSquareDetail,
    label: 'Polling Unit Data',
    sidebarOpen,
    url: '/polling-unit-data',
    roles: [Roles.PartyAgent, Roles.SuperAdmin, Roles.ObservationRoomAgent],
  },
  {
    icon: MdOutlinePermMedia,
    label: 'Polling Unit Issues',
    sidebarOpen,
    url: '/polling-unit-issues',
    roles: [Roles.PartyAgent, Roles.SuperAdmin, Roles.ObservationRoomAgent],
  },
  {
    icon: MdWifiOff,
    label: 'Offline Data',
    sidebarOpen,
    url: '/offline-upload',
    roles: [Roles.PartyAgent],
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
