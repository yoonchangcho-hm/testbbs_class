import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';

function ImageModifyComp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data: image, error: imageError } = await supabase
          .from('image_upload')
          .select('*')
          .eq('id', id)
          .single();

        if (imageError || !image) {
          setMessage('이미지 불러오기 실패: ' + imageError?.message);
          return;
        }

        setFileName(image.fileName);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setMessage('로그인이 필요합니다.');
          return;
        }

        if (user.id === image.user_id) {
          setIsOwner(true);
        } else {
          setMessage('수정 권한이 없습니다.');
        }
      } catch (err) {
        setMessage('예상치 못한 오류 발생');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      setMessage('파일명을 입력해주세요.');
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('image_upload')
        .update({ fileName })
        .eq('id', id);

      if (error) {
        setMessage('수정 실패: ' + error.message);
        console.error(error);
      } else {
        toast.success('수정 완료!');
        navigate(`/board/imageboard/view/${id}`);
      }
    } catch (err) {
      setMessage('예상치 못한 오류 발생');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!isOwner) return <p>{message || '권한이 없습니다.'}</p>;

  return (
    <div>
      <h3>이미지 수정</h3>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="파일명을 수정하세요"
        />
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? '수정 중...' : '수정'}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default ImageModifyComp;
