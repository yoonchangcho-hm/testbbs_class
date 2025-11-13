import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';

function ImageUploadComp() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUser(null);
      } else {
        setUser(user);
      }
    };

    checkAuth();
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
    if (!file) {
      toast.error('파일을 선택해주세요.');
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
        });

      if (insertError) {
        toast.error('DB 저장 실패: ' + insertError.message);
        setUploading(false);
        return;
      }

      toast.success('업로드 완료!');
      navigate('/board/imageboard/list');
    } catch (err) {
      toast.error('예상치 못한 오류 발생');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <p>이미지 업로드는 로그인한 사용자만 가능합니다.</p>;
  }

  return (
    <div>
      <h3>이미지 업로드</h3>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="파일명을 입력하세요"
        />
        <button type="submit" disabled={uploading}>
          {uploading ? '업로드 중...' : '업로드'}
        </button>
      </form>
    </div>
  );
}

export default ImageUploadComp;
