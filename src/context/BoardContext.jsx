import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utils/supabase';

const BoardContext = createContext();

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('BoardProvider 안에 있어야 함');
  }
  return context;
};

export const BoardProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const getPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .order('id', { ascending: false });

    if (!error) {
      setPosts(data);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const getPostsWithPagenation = async (page = 1, size = 10) => {
    const from = (page - 1) * size; // 0 10 20
    const to = from + size - 1; //9 19 29

    //count 개수
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error(countError);
      return { data: [], totalCount: 0, error: countError };
    }

    // 페이지네이션 데이터조회
    const { data, error } = supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false })
      .range(from, to);

    // select * from posts order by desc

    if (!error) {
      setPosts(data);
      setTotalCount(count);
      return { data: data, totalCount: count, error: null };
    }

    return { data: [], totalCount: count, error };
  };

  const value = {
    posts,
    totalCount,
    getPosts,
    getPostsWithPagenation,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
