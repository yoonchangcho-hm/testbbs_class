import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('userProvider 내부에 있어야 해요!!!');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [text, setText] = useState('안녕하세요 ');

  const signUp = () => {
    alert('test');
  };
  const value = {
    signUp,
    text,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
