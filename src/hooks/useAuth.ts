import { useAppSelector } from 'store/hooks';

function useAuth() {
  const { accessToken, userDetails } = useAppSelector((s) => s.auth);
  const isAuth = !!accessToken && !!userDetails;
  return { accessToken, userDetails, isAuth };
}

export default useAuth;
