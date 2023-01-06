import { useBreakpointValue } from '@chakra-ui/react';
import DesktopSidebar from './DesktopSidebar';
import MobileSidebar from './MobileSidebar';

function Sidebar() {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return <>{isDesktop ? <DesktopSidebar /> : <MobileSidebar />}</>;
}

export default Sidebar;
