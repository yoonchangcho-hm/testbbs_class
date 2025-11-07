import { createContext, useContext, useState } from 'react';
import supabase from '../utils/supabase';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('userProvider 내부에 있어야 해요!!!');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // const [text, setText] = useState('안녕하세요 ');
  const [loading, setLoading] = useState(false);

  const signUp = async (email, password, name, phone, text) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (!error) {
      const { error: userError } = await supabase
        .from('user_table')
        .insert([
          {
            id: data.user.id,
            name: name,
            phone: phone,
            text: text,
          },
        ])
        .select();
      if (!userError) {
        return { error: null };
      }
      return { error: userError };
    } else {
      return { error: error };
    }
  };
  const value = {
    loading, //변수
    signUp, //함수
    setLoading,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
