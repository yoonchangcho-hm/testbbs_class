import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';
import dayjs from 'dayjs';

function ImageViewComp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const { data: image, error } = await supabase
        .from('image_upload')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !image) {
        toast.error('이미지 조회 실패');
        setLoading(false);
        return;
      }

      setImageData(image);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.id === image.user_id) {
        setIsOwner(true);
      }

      setLoading(false);
    };

    fetchImage();
  }, [id]);

  const handleDelete = async () => {
    if (!imageData || !isOwner) return;
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const filePath = imageData.fileurl.split('/images/')[1];
      if (!filePath) {
        toast.error('파일 경로 추출 실패');
        setIsDeleting(false);
        return;
      }

      const { error: storageErr } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (storageErr) {
        toast.error('스토리지 삭제 실패: ' + storageErr.message);
        setIsDeleting(false);
        return;
      }

      const { error: dbErr } = await supabase
        .from('image_upload')
        .delete()
        .eq('id', id);

      if (dbErr) {
        toast.error('DB 삭제 실패: ' + dbErr.message);
        setIsDeleting(false);
        return;
      }

      toast.success('삭제 완료!');
      navigate('/board/imageboard/list');
    } catch (err) {
      toast.error('예상치 못한 오류 발생');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!imageData) return <p>이미지를 찾을 수 없습니다.</p>;

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '1rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>이미지 상세 보기</h3>

      <img
        src={imageData.fileurl}
        alt={imageData.fileName}
        style={{
          width: '100%',
          maxHeight: '400px',
          objectFit: 'contain',
          marginBottom: '1rem',
        }}
      />

      <h4 style={{ marginBottom: '0.5rem' }}>
        {imageData.title || imageData.fileName}
      </h4>

      <p style={{ color: '#666', marginBottom: '0.5rem' }}>
        업로드 날짜: {dayjs(imageData.created_at).format('YYYY.MM.DD HH:mm')}
      </p>

      <p style={{ color: '#666', marginBottom: '1rem' }}>
        작성자: {imageData.name || '알 수 없음'}
      </p>

      {imageData.content && (
        <div
          style={{
            marginBottom: '2rem',
            whiteSpace: 'pre-line',
            lineHeight: '1.6',
          }}
        >
          {imageData.content}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/board/imageboard/list')}>
          목록으로
        </button>
        {isOwner && (
          <>
            <button onClick={() => navigate(`/board/imageboard/modify/${id}`)}>
              수정
            </button>
            <button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </>
        )}
      </div>

      <div
        style={{
          textAlign: 'right',
          color: '#999',
          fontSize: '0.85rem',
          marginTop: '1rem',
        }}
      >
        파일명: {imageData.fileName}
      </div>
    </div>
  );
}

export default ImageViewComp;
