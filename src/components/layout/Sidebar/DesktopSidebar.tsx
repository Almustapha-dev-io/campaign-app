import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Center, IconButton, VStack } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { LayoutContext } from 'contexts/layout';
import SidebarItem, { LogoutSidebarItem } from './SidebarItem';
import { sidebarItems } from './sidebar-items';
import uuid from 'react-uuid';
import Logo from './Logo';
import useAuth from 'hooks/useAuth';

function DesktopSidebar() {
  const { sidebarOpen, toggleSidebar } = useContext(LayoutContext);

  const width = useMemo(() => {
    return sidebarOpen ? '250px' : '80px';
  }, [sidebarOpen]);

  const { userDetails } = useAuth();

  if (!userDetails) return null;

  const userRoles = userDetails.roles.map((r) => r.name);

  return (
    <Box
      w={width}
      position="fixed"
      left="0"
      top="0"
      h="full"
      shadow="sm"
      transition="width .2s"
      py="4"
      bg="white"
      roundedRight="2xl"
    >
      <IconButton
        aria-label="toggle sidebar"
        icon={
          <ChevronDownIcon
            fontSize="xl"
            transition="all .5s"
            transform={sidebarOpen ? 'rotate(90deg)' : 'rotate(-90deg)'}
          />
        }
        size="md"
        rounded="full"
        variant="ghost"
        bg="green.100"
        _active={{ bg: 'green.200' }}
        _hover={{ bg: 'green.200' }}
        onClick={toggleSidebar}
        position="absolute"
        right="-18px"
        top="85px"
      />
      <VStack w="full" h="full" align="flex-start" overflow="hidden" pb="30px">
        <Center w="full" h="80px" px={sidebarOpen ? 4 : 2} py="0" mb="6">
          <Logo
            width={sidebarOpen ? '80px' : '50px'}
            height={sidebarOpen ? '80px' : '50px'}
          />
        </Center>

        <VStack
          w="full"
          flex="1"
          overflow="auto"
          as="nav"
          spacing="4"
          py="2"
          px={sidebarOpen ? 4 : 2}
        >
          {sidebarItems(sidebarOpen).map((sidebarItem) => (
            <>
              {userRoles.some((role) => sidebarItem.roles.includes(role)) ? (
                <SidebarItem key={uuid()} {...sidebarItem} />
              ) : null}
            </>
          ))}
        </VStack>

        <VStack w="full" py="2" px={sidebarOpen ? 4 : 2}>
          <LogoutSidebarItem sidebarOpen={sidebarOpen} />
        </VStack>
      </VStack>
    </Box>
  );
}

export default DesktopSidebar;
