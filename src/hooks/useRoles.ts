import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store/hooks';
import { logOut } from 'store/reducers/auth-slice';
import { Roles } from 'types/roles';
import useAuth from './useAuth';

const useRoles = (roles: Set<Roles>) => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userDetails) {
      dispatch(logOut());
    } else {
      const userRoles = userDetails.roles.map((r) => r.name);
      if (!userRoles.some((role) => roles.has(role))) {
        toast('Access to resource denied', {
          type: 'warning',
          toastId: 'access-denied',
        });
        navigate('/dashboard', { replace: true });
      }
    }
  }, [dispatch, navigate, roles, userDetails]);
};

export default useRoles;
