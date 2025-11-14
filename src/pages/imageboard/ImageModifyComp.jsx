import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';

function ImageModifyComp() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
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
        } else {
          setFileName(image.fileName);
          setTitle(image.title || '');
          setContent(image.content || '');
          setAuthor(image.name || '');
          setCurrentImageUrl(image.fileurl || '');

          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            setMessage('로그인이 필요합니다.');
          } else {
            setIsOwner(user.id === image.user_id);
          }
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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setFileName('');
      setPreviewUrl('');
    }
  };

  const handleDeleteImage = async () => {
    if (!fileName) return;

    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([fileName]);

    if (deleteError) {
      setMessage('이미지 삭제 실패: ' + deleteError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from('image_upload')
      .update({ fileName: '', fileurl: '' })
      .eq('id', id);

    if (updateError) {
      setMessage('DB 업데이트 실패: ' + updateError.message);
      return;
    }

    toast.success('이미지 삭제 완료!');
    setCurrentImageUrl('');
    setFileName('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage('제목과 내용을 입력해주세요.');
      return;
    }

    setIsUpdating(true);

    try {
      const updatedFields = { title, content };

      if (file) {
        const filePath = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          setMessage('이미지 업로드 실패: ' + uploadError.message);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('images').getPublicUrl(filePath);

        updatedFields.fileName = file.name;
        updatedFields.fileurl = publicUrl;
      }

      const { error } = await supabase
        .from('image_upload')
        .update(updatedFields)
        .eq('id', id);

      if (error) {
        setMessage('수정 실패: ' + error.message);
      } else {
        toast.success('수정 완료!');
        navigate(`/board/imageboard/view/${id}`);
      }
    } catch (err) {
      setMessage('예상치 못한 오류 발생');
      console.error(err);
    } finally {
      setIsUpdating(false);
      setFile(null);
      setFileName('');
      setPreviewUrl('');
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
    <div style={{ maxWidth: '720px', margin: '3rem auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>이미지 수정</h2>
      <form onSubmit={handleUpdate}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* 입력 영역 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div>
              <label style={{ fontWeight: 'bold' }}>이미지 파일 선택</label>
              <input key={fileName} type="file" onChange={handleFileChange} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>선택된 파일명</label>
              <input
                type="text"
                value={fileName}
                disabled
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  color: '#555',
                  width: '100%',
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: '0.5rem', width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                style={{ padding: '0.5rem', width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>작성자</label>
              <input
                type="text"
                value={author}
                disabled
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '0.75rem',
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
              <p style={{ color: 'red', marginTop: '0.5rem' }}>{message}</p>
            )}
          </div>

          {/* 이미지 비교 영역 */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div>
              <strong>현재 이미지</strong>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.3rem',
                }}
              >
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="현재 이미지"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      lineHeight: '120px',
                      color: '#888',
                    }}
                  >
                    없음
                  </div>
                )}
              </div>
              {currentImageUrl && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.9rem',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  이미지 삭제
                </button>
              )}
            </div>

            <div>
              <strong>변경될 이미지</strong>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.3rem',
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="변경 이미지"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      lineHeight: '120px',
                      color: '#888',
                    }}
                  >
                    선택된 파일 없음
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ImageModifyComp;
