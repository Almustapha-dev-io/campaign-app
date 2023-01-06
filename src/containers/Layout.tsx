import { Box } from '@chakra-ui/react';
import Main from 'components/layout/Main';
import Sidebar from 'components/layout/Sidebar';
import LayoutContextProvider from 'contexts/layout';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  return (
    <LayoutContextProvider>
      <Box w="full" h="full" position="relative">
        <Sidebar />
        <Main>
          <Outlet />
        </Main>
      </Box>
    </LayoutContextProvider>
  );
}

export default Layout;
