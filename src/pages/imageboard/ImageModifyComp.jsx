import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';

function ImageModifyComp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
        setTitle(image.title || '');
        setContent(image.content || '');

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
    if (!fileName.trim() || !title.trim() || !content.trim()) {
      setMessage('모든 항목을 입력해주세요.');
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('image_upload')
        .update({ fileName, title, content })
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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>로딩 중...</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          {message || '권한이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>이미지 수정</h2>
      <form
        onSubmit={handleUpdate}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="파일명"
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          rows="4"
          style={{ padding: '0.5rem', fontSize: '1rem', resize: 'vertical' }}
        />
        <button
          type="submit"
          disabled={isUpdating}
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            opacity: isUpdating ? 0.6 : 1,
          }}
        >
          {isUpdating ? '수정 중...' : '수정'}
        </button>
        {message && (
          <p style={{ color: 'red', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default ImageModifyComp;
