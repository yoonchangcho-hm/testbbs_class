import { createContext, useContext, useEffect, useState } from 'react';
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('sesion 준비');
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      console.log(data.session);

      // const session = data
    };
    loadUser();
  }, []);

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
            id: data.user.id, //uuid 32난수
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

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      setUser(data.user);
      return { error: null };
    } else {
      return { error };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      return { error: null };
    }
    return { error };
  };

  const value = {
    loading, //변수
    user,
    signUp, //함수
    signIn,
    logout,
    setLoading,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
