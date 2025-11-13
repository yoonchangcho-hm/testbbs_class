import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';

function ImageUploadComp() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        setUser(null);
      } else {
        setUser(user);
      }
    });
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !fileName.trim() || !title.trim() || !content.trim()) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }

    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setUploading(true);

    try {
      const filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('업로드 실패: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('image_upload')
        .insert({
          fileName,
          fileurl: publicUrl,
          user_id: user.id,
          name: user.email,
          title,
          content,
        });

      if (insertError) {
        toast.error('DB 저장 실패: ' + insertError.message);
        setUploading(false);
        return;
      }

      toast.success('업로드 완료!');
      navigate('/board/imageboard/list', { replace: true });
      // 또는 강제 새로고침
      // window.location.href = '/board/imageboard/list';
    } catch (err) {
      toast.error('예상치 못한 오류 발생');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          이미지 업로드는 로그인한 사용자만 가능합니다.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        이미지 업로드
      </h2>
      <form
        onSubmit={handleUpload}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label
            style={{
              fontWeight: 'bold',
              marginBottom: '0.3rem',
              display: 'block',
            }}
          >
            이미지 파일
          </label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div>
          <label
            style={{
              fontWeight: 'bold',
              marginBottom: '0.3rem',
              display: 'block',
            }}
          >
            파일명
          </label>
          <input
            type="text"
            value={fileName}
            disabled
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              color: '#555',
              cursor: 'not-allowed',
              width: '100%',
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontWeight: 'bold',
              marginBottom: '0.3rem',
              display: 'block',
            }}
          >
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
          />
        </div>

        <div>
          <label
            style={{
              fontWeight: 'bold',
              marginBottom: '0.3rem',
              display: 'block',
            }}
          >
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            rows="4"
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              resize: 'vertical',
              width: '100%',
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontWeight: 'bold',
              marginBottom: '0.3rem',
              display: 'block',
            }}
          >
            작성자
          </label>
          <input
            type="text"
            value={user.email}
            disabled
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              color: '#555',
              cursor: 'not-allowed',
              width: '100%',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      </form>
    </div>
  );
}

export default ImageUploadComp;
