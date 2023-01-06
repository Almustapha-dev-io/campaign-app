import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { TUser } from 'types/user';

type TUserContext = {
  selectedUser: TUser | null;
  setSelectedUser(user: TUser | null): void;
};

export const UserContext = createContext<TUserContext>({
  selectedUser: null,
  setSelectedUser() {},
});

function UserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<TUser | null>(null);

  const setSelectedUser = useCallback((_user: TUser | null) => {
    setUser(() => _user);
  }, []);

  return (
    <UserContext.Provider value={{ selectedUser: user, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
