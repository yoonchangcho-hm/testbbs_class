import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../utils/supabase';

const ImageBoardContext = createContext();

export function ImageBoardProvider({ children }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('image_upload')
        .select('id, "fileName", fileurl, created_at') //  대소문자 구분 컬럼
        .order('created_at', { ascending: false });

      if (error) {
        console.error('이미지 불러오기 실패:', error.message);
      } else {
        setImages(data);
      }
    } catch (err) {
      console.error('예상치 못한 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <ImageBoardContext.Provider value={{ images, loading, fetchImages }}>
      {children}
    </ImageBoardContext.Provider>
  );
}

export function useImageBoard() {
  return useContext(ImageBoardContext);
}
