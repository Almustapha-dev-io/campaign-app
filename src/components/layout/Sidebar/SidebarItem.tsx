import {
  Button,
  Fade,
  HStack,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SlideFade,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { TSidebarItem } from 'types/sidebar';
import { FiLogOut } from 'react-icons/fi';
import { useAppDispatch } from 'store/hooks';
import { logOut } from 'store/reducers/auth-slice';

type Props = TSidebarItem & {};

function SidebarItem({ icon, label, sidebarOpen, url }: Props) {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const showPopover = isDesktop && !sidebarOpen;

  return (
    <Link
      as={NavLink}
      to={url}
      w="full"
      rounded="xl"
      _activeLink={{
        bg: 'green.100',
      }}
      _hover={{
        '&:not(.active)': {
          bg: 'green.50',
        },
      }}
      transition="all .5s"
    >
      <Popover placement="right-end" trigger="hover">
        <PopoverTrigger>
          <HStack
            w="full"
            px={sidebarOpen ? 4 : 0}
            py="3"
            spacing="4"
            justify={sidebarOpen ? 'flex-start' : 'center'}
            color="green.700"
          >
            <Icon w="22px" h="22px" as={icon} />
            {sidebarOpen && (
              <Text fontSize="sm" fontWeight="semibold">
                {label}
              </Text>
            )}
          </HStack>
        </PopoverTrigger>
        {showPopover && (
          <PopoverContent w="fit-content" fontSize="sm">
            <PopoverArrow />
            <PopoverBody>{label}</PopoverBody>
          </PopoverContent>
        )}
      </Popover>
    </Link>
  );
}

export function LogoutSidebarItem({
  sidebarOpen,
}: Pick<TSidebarItem, 'sidebarOpen'>) {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const showPopover = isDesktop && !sidebarOpen;

  const dispatch = useAppDispatch();

  return (
    <Popover placement="right-end" trigger="hover">
      <PopoverTrigger>
        <Button
          variant="link"
          w="full"
          rounded="xl"
          _active={{
            bg: 'red.100',
          }}
          _hover={{
            '&:not(.active)': {
              bg: 'red.50',
            },
          }}
          transition="all .5s"
          onClick={() => dispatch(logOut())}
        >
          <HStack
            w="full"
            px={sidebarOpen ? 4 : 0}
            py="3"
            spacing="4"
            justify={sidebarOpen ? 'flex-start' : 'center'}
            color="red.500"
          >
            <Icon w="22px" h="22px" as={FiLogOut} />
            {sidebarOpen && (
              <Text fontSize="sm" fontWeight="semibold">
                Logout
              </Text>
            )}
          </HStack>
        </Button>
      </PopoverTrigger>
      {showPopover && (
        <PopoverContent w="fit-content" fontSize="sm">
          <PopoverArrow />
          <PopoverBody>Logout</PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
}

export default SidebarItem;
