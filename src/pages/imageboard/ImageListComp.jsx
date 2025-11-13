import { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function ImageListComp() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('image_upload')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('이미지 불러오기 실패:', error.message);
        setImages([]);
      } else {
        setImages(data || []);
      }
      setLoading(false);
    };

    fetchImages(); // 최초 실행

    const interval = setInterval(() => {
      fetchImages(); // 3초마다 자동 새로고침
    }, 3000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  const truncateContent = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>이미지 리스트</h3>
        <Link to="/board/imageboard/upload" className="btn btn-primary">
          이미지 업로드
        </Link>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : images.length === 0 ? (
        <p>등록된 이미지가 없습니다.</p>
      ) : (
        <div className="row">
          {images.map((img, i) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={i}>
              <Link
                to={`/board/imageboard/view/${img.id}`}
                className="text-decoration-none"
              >
                <div className="card">
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4 / 3',
                      overflow: 'hidden',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    <img
                      src={img.fileurl}
                      alt={img.fileName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{img.title || img.fileName}</h5>
                    <p className="card-text">{truncateContent(img.content)}</p>
                  </div>
                  <div className="card-footer text-muted small">
                    {dayjs(img.created_at).format('YY.MM.DD')}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageListComp;
