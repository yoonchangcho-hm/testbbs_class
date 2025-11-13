import { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function ImageListComp() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('image_upload')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('이미지 불러오기 실패:', error.message);
      } else {
        setImages(data);
      }
    };

    fetchImages();
  }, []);

  // 내용 요약 함수
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

      {images.length === 0 ? (
        <p>등록된 이미지가 없습니다.</p>
      ) : (
        <div className="row">
          {images.map((img, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <Link
                to={`/board/imageboard/view/${img.id}`}
                className="text-decoration-none"
              >
                <div className="card h-100">
                  <img
                    src={img.fileurl}
                    alt={img.fileName}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
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
