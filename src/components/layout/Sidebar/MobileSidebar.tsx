import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { LayoutContext } from 'contexts/layout';
import useAuth from 'hooks/useAuth';
import { useContext } from 'react';
import uuid from 'react-uuid';
import Logo from './Logo';
import { sidebarItems } from './sidebar-items';
import SidebarItem, { LogoutSidebarItem } from './SidebarItem';

function MobileSidebar() {
  const { sidebarOpen, toggleSidebar } = useContext(LayoutContext);

  const { userDetails } = useAuth();
  if (!userDetails) return null;
  const userRoles = userDetails.roles.map((r) => r.name);

  return (
    <>
      <HStack
        as="header"
        h="80px"
        w="full"
        position="fixed"
        top="0"
        left="0"
        justify="space-between"
        align="center"
        shadow="sm"
        px="4"
        bg="white"
        zIndex="docked"
      >
        <Logo width="60px" height="60px" />
        <IconButton
          aria-label="toggle sidebar"
          icon={<HamburgerIcon fontSize="xl" />}
          variant="ghost"
          onClick={toggleSidebar}
        />
      </HStack>

      <Drawer
        blockScrollOnMount={false}
        isOpen={sidebarOpen}
        placement="left"
        onClose={toggleSidebar}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Logo width="60px" height="60px" />
          </DrawerHeader>
          <DrawerBody>
            <VStack w="full" mt="10" spacing="4">
              {sidebarItems(sidebarOpen).map((sidebarItem) => (
                <>
                  {userRoles.some((role) =>
                    sidebarItem.roles.includes(role)
                  ) ? (
                    <SidebarItem key={uuid()} {...sidebarItem} />
                  ) : null}
                </>
              ))}
              <LogoutSidebarItem sidebarOpen={sidebarOpen} />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default MobileSidebar;
