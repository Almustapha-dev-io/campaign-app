import { Box, useBreakpointValue } from '@chakra-ui/react';
import { LayoutContext } from 'contexts/layout';
import { PropsWithChildren, useContext, useMemo } from 'react';

function Main({ children }: PropsWithChildren) {
  const { sidebarOpen } = useContext(LayoutContext);
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const paddingLeft = useMemo(() => {
    if (!isDesktop) return 4;
    return sidebarOpen ? '285px' : '116px';
  }, [sidebarOpen, isDesktop]);

  const marginTop = useMemo(() => {
    if (isDesktop) return;
    return '80px';
  }, [isDesktop]);

  return (
    <Box
      w="full"
      minH="full"
      bg="gray.50"
      pl={paddingLeft}
      pr={{ base: 4, lg: 8 }}
      py="8"
      mt={marginTop}
      transition="all .2s"
      as="main"
    >
      <Box w="full" mx="auto" maxW="container.xl" minH="inherit">
        {children}
      </Box>
    </Box>
  );
}

export default Main;
